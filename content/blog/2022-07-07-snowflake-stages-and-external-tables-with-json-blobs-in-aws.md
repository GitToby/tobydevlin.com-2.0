---
layout: post
date: 2022-07-07T15:00:00.000Z
title: Snowflake Stages and External Tables with JSON Blobs in AWS
publish: true
image: /content/img/netlifyCMS/snowflake-unsplash.jpg
tags:
  - snowflake
  - dbt
  - aws
---


Snowflake has a few ways to interact with external data, one of which
is [Stages](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html)
and [external tables](https://docs.snowflake.com/en/sql-reference/sql/create-external-table.html). The docs on most
things in Snowflake are amazing, so I'm not going to copy them here, this will just be a guide on how to set up large
JSON blobs with these tools. We will be creating an External Table in Snowflake which queries the underlying JSON blob
residing in an AWS s3 bucket.

## Setup

To get started we will be operating with AWS and Snowflake, so access to these would be required. Once you have these
we will be working in steps:

1. create internal Stage
2. `copy into` from this Stage
3. create External Stage
4. create External Table

To start we should create a PoC workspace, we will be using whichever is the default warehouse for your user for loading
data:

```sql
USE ROLE sysadmin;
CREATE OR REPLACE DATABASE stages_and_external_tables_poc;
USE DATABASE stages_and_external_tables_poc;
CREATE SCHEMA IF NOT EXISTS external_poc;
USE SCHEMA external_poc;
```

Now we can get started.

## 1. Stages

Creating an internal stage is as simple as following
the [docs](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html). We will be using some mock data I have
pulled from [mockaroo](https://www.mockaroo.com/).

Here's the code to create the internal stage, to start. We will create a minimal named and internal stage & copy the
files in. (we will add bells and whistles later)

**Table Stages**

Each table implicitly has a stage associated with it, named `@%<table_name>`. So we can just create a single column
table in order to store our JSON blobs, explicit telling it were using a JSON blob rather than a CSV. For the file path
structure; I'm using a Mac, but similar file structures are
found [here](https://docs.snowflake.com/en/user-guide/data-load-local-file-system-stage.html#staging-the-data-files):

```sql
CREATE OR REPLACE TABLE src_mock_data
  STAGE_FILE_FORMAT =
(
  TYPE = JSON
)
(
  file_content VARIANT
);
PUT file:///Users/toby.devlin/dev/data/mocks/mock_1.json @%src_mock_data;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_2.json @%src_mock_data;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_3.json @%src_mock_data;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_4.json @%src_mock_data;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_5.json @%src_mock_data;
LIST @%src_mock_data;
```

Now we can copy into this table the files we've just uploaded. The data will be copied as everything into
the [variant type](https://docs.snowflake.com/en/sql-reference/data-types-semistructured.html#label-data-type-variant)
column we created. You can't create more than 1 column with JSON -> `VARIANT` types, but CSVs can have multiple columns.

```sql
COPY INTO src_mock_data FROM @%src_mock_data;
SELECT *
  FROM src_mock_data;
```

Note that we don't remove the files from the stage if we run `LIST @%src_mock_data;` again. There are ways to dictate
how the stage files are treated and how semi-structured data is injected, see
the [copy-options](https://docs.snowflake.com/en/sql-reference/sql/create-table.html#label-create-table-copyoptions) for
more info.

**Named Stages**

Named stages are almost the same as table stages, but you have to define them. They live in a schema and will
appear when queried with `SHOW STAGES` and settings shown with `DESCRIBE STAGE`.

```sql
CREATE OR REPLACE STAGE poc_internal_stage
  FILE_FORMAT = ( TYPE = JSON);
SHOW STAGES;
DESCRIBE STAGE poc_internal_stage;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_1.json @poc_internal_stage;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_2.json @poc_internal_stage;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_3.json @poc_internal_stage;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_4.json @poc_internal_stage;
PUT file:///Users/toby.devlin/dev/data/mocks/mock_5.json @poc_internal_stage;
LIST @poc_internal_stage;
```

Again, we can copy these files into a table, but we will need to create a table if one doesn't exist. This example also
shows copy as a select statement,
allowing [arbitrary transform statements](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html#transformation-parameters)
to be executed. `$n` is the "column", always 1 in our JSON use case and `:<element>` refs the path in the JSON itself.
We could also use selectors for specific files in the sage, such
as `data.$1:id from FROM @poc_internal_stag/mock_1 AS data`, for example.

```sql
CREATE OR REPLACE TABLE src_mock_data_2
(
  file_content     VARIANT,
  file_name        STRING,
  record_id        INT,
  record_last_name STRING
);
COPY INTO src_mock_data_2 FROM (SELECT $1, metadata$filename, $1:id, $1:last_name
                                  FROM @poc_internal_stage);
SELECT *
  FROM src_mock_data_2;
```

## 2. External Stages

As we progress through to externalizing the stages, the concept remains the same. We have files with data, and we want
them to be data in a table. However, now these files may live in cloud storage object store. I'm most familiar with AWS,
so I will create an S3 bucket to store these objects in. Below is the Terraform for creating a private bucket. It also
uploads the local file data using
the [`aws_s3_object`](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_object). Be sure to
replace the file path as above.

> Note: you will need to provide the Terraform user with policies in line with `IAMFullAccess` and `AmazonS3FullAccess`
> to complete the next steps. Either directly or via an assumed role; I'm using a shortcut and attaching these to the
> user.

```terraform
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.21.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = "" #  replace me
  secret_key = ""
}


module "s3_bucket" {
  source     = "terraform-aws-modules/s3-bucket/aws"
  version    = "3.3.0"
  bucket     = "poc-snowflake-external-stage-bucket"
  acl        = "private"
  versioning = {
    enabled = false
  }
}

resource "aws_s3_object" "object" {
  bucket = module.s3_bucket.s3_bucket_id
  key    = "mock_${count.index+1}.json"
  source = "/Users/toby.devlin/dev/data/mocks/mock_${count.index+1}.json"
  etag   = filemd5("/Users/toby.devlin/dev/data/mocks/mock_${count.index+1}.json")
  count  = 5
}
```

Now we have the bucket up and running we can create the stage in snowflake and provide it accesses. Along with the
bucket, we will also create an IAM user to interact with the bucket rather than use our Terraform provisioner user. This
is an optional step if you want to use your admin user you can if it has the permissions.

> Note: the file `setup_stage.sql` will contain the secret access keys for this user. You should ensure the values in
> this file remains secret; in the real world it may be worth placing this into something like AWS Secrets Manager or
> manually creating IAM creds as there are
> some [security flaws](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_access_key#secret)
> using this shortcut approach.

```terraform
resource "aws_iam_user" "snowflake_s3_accessor" {
  name = "snowflake_s3_accessor"
  path = "/snowflake/"
}

resource "aws_iam_access_key" "snowflake_s3_accessor" {
  user = aws_iam_user.snowflake_s3_accessor.id
}

data "aws_iam_policy_document" "snowflake_s3_access" {
  statement {
    sid     = "${replace(title(module.s3_bucket.s3_bucket_id), "-", "")}Access"
    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation"
    ]
    resources = [
      "arn:aws:s3:::${module.s3_bucket.s3_bucket_id}",
    ]
  }
  statement {
    sid     = "${replace(title(module.s3_bucket.s3_bucket_id), "-", "")}ItemAccess"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:DeleteObject",
      "s3:DeleteObjectVersion"
    ]
    resources = [
      "arn:aws:s3:::${module.s3_bucket.s3_bucket_id}/*",
    ]
  }
}

resource "aws_iam_user_policy" "snowflake_s3_access" {
  name   = "snowflake_s3_bucket_access"
  user   = aws_iam_user.snowflake_s3_accessor.name
  policy = data.aws_iam_policy_document.snowflake_s3_access.json
}

resource "local_sensitive_file" "iam_creds_out" {
  filename = "setup_stage.sql"
  content  = <<-EOT
        CREATE OR REPLACE STAGE poc_external_stage
          URL = 's3://${module.s3_bucket.s3_bucket_id}'
          CREDENTIALS = (
            AWS_KEY_ID = '${aws_iam_access_key.snowflake_s3_accessor.id}'
            AWS_SECRET_KEY = '${aws_iam_access_key.snowflake_s3_accessor.secret}'
          )
          FILE_FORMAT = (TYPE = JSON);
        EOT
}
```

Now we have everything we need to get started, we can begin the Snowflake side of things. We want to create the stage
in a similar way to before but using the External syntax. All the variables needed can be found in `setup_stage.sql`.

```sql
CREATE OR REPLACE STAGE poc_external_stage
  URL = 's3://poc-snowflake-external-stage-bucket'
  CREDENTIALS = (AWS_KEY_ID = '<your_access_key>' AWS_SECRET_KEY = '<your_secret_key>' )
  FILE_FORMAT = ( TYPE = JSON );
SHOW STAGES;
DESCRIBE STAGE poc_external_stage;
LIST @poc_external_stage;
```

Now the stage is created we can also see the existing files have been associated with the stage
with `LIST @poc_external_stage;`. From here the same approach as before can be taken to copy in these files as if it
were an internal named stage.

```sql
CREATE OR REPLACE TABLE src_mock_data_3
(
  file_content     VARIANT,
  file_name        STRING,
  record_id        INT,
  record_last_name STRING
);
COPY INTO src_mock_data_3 FROM (SELECT $1, metadata$filename, $1:id, $1:last_name
                                  FROM @poc_external_stage);
SELECT *
  FROM src_mock_data_3;
```

## 3. External Tables

External tables are, syntactically, very similar to normal tables. As
the [docs](https://docs.snowflake.com/en/user-guide/tables-external.html) describe they essentially read files from the
remote store when requested. As with the above sections, there are steps we can take to improve the performance, security and
isolation of these resources, but we will focus on getting it up and running.

The first step is to create the table itself.

```sql
 CREATE OR REPLACE EXTERNAL TABLE src_mock_data_external
(
    file_name        STRING AS (metadata$filename),
    record_id        INT AS (VALUE:"id"::INT),
    record_last_name STRING AS (VALUE:"last_name"::VARCHAR)
)
    LOCATION = @poc_external_stage
    FILE_FORMAT = (TYPE = JSON);
```

The content will automatically be populated into a table we can query To test out the new data you can place new files
into the bucket and run the refresh command `ALTER EXTERNAL TABLE src_mock_data_external REFRESH;` then the select query
again, showing updates to the underlying data.


```sql
SHOW EXTERNAL TABLES;
SELECT *
  FROM src_mock_data_external;
```

This manual refresh has to be done each time unless updates to this table
are published to the AWS SQS topic that is created for the table. This can be SQS topic can be hit by anything, but the recommended way is [by publishing s3 change events](https://docs.snowflake.com/en/user-guide/tables-external-s3.html#step-3-configure-event-notifications). 

### Caveats & Considerations

- When working with extremely large JSON blobs, larger than the max
  size ([16,777,216 bytes](https://docs.snowflake.com/en/sql-reference/data-types-text.html#varchar)) stages will fail
  their `COPY INTO` commands & External Tables will fail silently to load the data into the table.
- We have taken some shortcuts such as creating the AWS integration query in a local file - This can be hardened with
  proper secrets management & terraform state storage.
- Setting up change notifications on external stages is probably a very useful tool, meaning you could even process these files in multiple systems at once.
- Understanding
  the [`COPY INTO` settings](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html) and
  various [Stage settings](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html#syntax)
  allows for flexible operations on the stages files & how to reduce processing after load.
- The billing associated with Stages is part of the
  Snowflakes [serverless billing](https://docs.snowflake.com/en/user-guide/admin-serverless-billing.html) and should be
  understood before heavyweight processing.
