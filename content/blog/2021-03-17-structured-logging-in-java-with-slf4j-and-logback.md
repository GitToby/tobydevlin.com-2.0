---
layout: post
title: Structured Logging in Java with SLF4j and Logback
publish: true
image: /content/img/netlifyCMS/logs.jpg
tags:
  - json logging java
---
Adding Structured JSON logging when using SLF4J is quite simple once you understand the logger structure. This post will cover a quick implementation of how to add JSON structured logging to your app with [SLF4J](http://www.slf4j.org/) using [Logback](http://logback.qos.ch/) and the [logstash-logback-encoder](https://github.com/logstash/logstash-logback-encoder).

## First a bit of background.

Typically all logs follow a certain pattern in every language. That is as follows, generated -> picked up -> parsed and enriched -> splat out in the correct place/places. For example, in Java, a logger in `HelloWorld.java`, set up via SLF4J (an adapter) and Logback (a log handler), can create a log event with a timestamp, level, source info and a message. This event will be picked up by a Logback adapter, parsed for level, potentially enriched with some more data then forwarded on to be spat out in a console, file or a udp/tcp stream or something else. This is common in other languages too, such as python and Javascript - only with some caveats on the semantics.

# Java Example

I'm going to assume you have a typical project set up, being built with Maven and it runs. Below is an example of my `HelloWorld` class and the initial SLF4J dependancy:

```java
package com.tobydevlin.examples.logging

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
    private static final Logger LOG = LoggerFactory.getLogger(HelloWorld.class);

    public static void main(String[] args) {
        LOG.info("hello world!");
    }
}
```

```xml
<dependencies>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.30</version>
        </dependency>
</dependencies>
```

All it does is log out a single thing, and when you run it you get this:

```
[main] INFO HelloWorld - hello world!
```

The next step would be to add some more intelligent handling under the hood, at the moment we're using the built-in java logging framework. So lets add 2 dependencies to our POM, 2 for Logback, the more powerful logger that works with the SLF4J facade, and one for logstash-logback-encoder, an extension to allow us to log in json easily.

```xml
   <dependencies>
        <!-- Logging -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.30</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.2.3</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
            <version>1.2.3</version>
        </dependency>
        <!-- Json Logging-->
        <dependency>
            <groupId>net.logstash.logback</groupId>
            <artifactId>logstash-logback-encoder</artifactId>
            <version>6.6</version>
        </dependency>
    </dependencies>
```

From here Logback only requires a logback.xml config file on the classpath to be configured with formatting and such. Below is the first, basic, config, to log everything to a file and to the console with a given format. Place this in your resources folder.

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} | [%thread] | %-5level | %logger{36} | %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>myApp.log</file>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} | [%thread] | %-5level | %logger{36} | %msg%n</pattern>
        </encoder>
    </appender>

    <root level="info">
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

When run this should now print a more detailed message to the console and also a file `myApp.log` should have also been made with a copy of the output.

```
18:39:14.687 | [main] | INFO  | HelloWorld | hello world!
```

Now to JSONafy these logs. The logstash libs make this incredibly easy, allowing us to just use one of their encoder classes. My new `logback.xml` file looks like the below.

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
        </encoder>
    </appender>

    <root level="info">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
``` 

This one doesn't log to a file, but can be configured very easily. A benefit of this encoder is it will automatically add information added with their `net.logstash.logback.argument.StructuredArguments.*` utilities. A good example of this is the `value()` and `keyValue()` methods, or `v()` and `kv()` for short. I've rewritten the main method to include some pairs.

```java
    public static void main(String[] args) {
        LOG.info("hello world! {} {}", keyValue("name", "toby"), value("time_taken", 123456));
        LOG.info("hello world! {} {}", v("name", "toby"), kv("time_taken", 123456));
    }
```

Which will output

```
{"@timestamp":"2021-03-17T12:51:07.180Z","@version":"1","message":"hello world! name=toby 123456","logger_name":"HelloWorld","thread_name":"main","level":"INFO","level_value":20000,"name":"toby","time_taken":123456}
{"@timestamp":"2021-03-17T12:51:07.196Z","@version":"1","message":"hello world! toby time_taken=123456","logger_name":"HelloWorld","thread_name":"main","level":"INFO","level_value":20000,"name":"toby","time_taken":123456}
```

Now we can add any number of parameters and they will be placed into the output as JSON keys. There are lots more meta information enrichment features and streaming add-ins to the logstash api, more info in the resources.

### Resources
- [slf4j ref](http://www.slf4j.org/manual.html)
- [logback.xml ref](http://logback.qos.ch/manual/configuration.html)
- [logback.xml log level paths](https://stackoverflow.com/questions/5653062/how-can-i-configure-logback-to-log-different-levels-for-a-logger-to-different-de)
- [logstash encoder github](https://github.com/logstash/logstash-logback-encoder)


