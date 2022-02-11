---
layout: post
date: 2022-01-27 10:25:28
title: Machine Learning Platform Best Practices
image: "/content/img/netlifyCMS/dmitry-ratushny-o33ivnpb0ri-unsplash.jpg"
publish: false
tags:
- machine learning
- python

---
# Machine Learning Platform Best Practices

I've not written about my fore into Machine Learning at all. As far as my professional role as a Senior Engineer goes, I've at least dabbled in most mainstream tools out there. And as a Senior Data Engineer, I've focused recently on the applications of tools in the data space, including modelling, munging and machine learning. This post is more of a refresher - something I can refer back to in order to quickly get back running on a project where at least a simplistic overview is required.

So what will I detail in the end? I'd like to show that ML in this post (and in most rudimentary models) is essentially curve fitting for lack of better words. The machine is learning how to predict a value `y,` based on a set of input variables `x`. This post isn't meant to break the bounds of ML, here `x` is just a tuple of floats, a set of numeric values that describe the underlying data. We don't go into handling categories or more structured, contextual data such as time-series or natural language.

By the end, you'll have seen, at least from a regression point of view, a way of understanding goals and how models may be more accustomed to solving certain problems. If this interests me enough I might do a second part on how the underlying models work, or we could just jump into neural models and skip the old school ML. Side note: I'd like to do a history of ML at some point too.

## Getting Started

The first bits of python is always meta executions, setting up libs and the like - ill comment on what's going on at each point.

The first cell contains commented out operations to install the notebook deps - I operate locally and use poetry for deps, the `poetry.toml` is in an appendix.

_It's worth noting this was written in a jupyter notebook_

```python
# !pip install pandas=="^1.4.0"
# !pip install plotly=="^5.5.0"
# !pip install scikit-learn=="^1.0.2"
# !pip install kaggle=="^1.5.12"
# !pip install jupyter=="^1.0.0"
# !pip install seaborn=="^0.11.2"
```

```python
# various imports, google for info
import time
import timeit

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# default plot to sns and style to be nicer to the eyes in dark mode
sns.set_theme(
    context='notebook', style='darkgrid', color_codes=True,
    font_scale=1.5, rc={'figure.figsize': (20, 10)}
)

# reproducibility
SEED = 1234
np.random.seed(SEED)
```

```python
# Magic lines like this mean we can set notebook properties, see below for more
# https://ipython.readthedocs.io/en/stable/interactive/magics.html
%config InlineBackend.figure_format = 'svg'
```

## Data download

data should be extracted to the /data dir, it's from [kaggles housesalesprediction dataset](https://www.kaggle.com/harlfoxem/housesalesprediction), a great resource for learning ML. I hope you stumbled across that website before this post. To set up run the below, this will pull down a zip of the files we want. You'll need to unzip and place in the format below.

`poetry run kaggle datasets download -d harlfoxem/housesalesprediction`

    /data
      /...
      /kc_house_data.csv
      /- ...
    /house_prices.ipynb

## Looking at the data

This next section looks at the data in the resulting CSV. As far as data goes its lovely, with no horrible decisions we need to make about munging. in the real world this next step is much more important and can change the results from a mediocre model to an amazing one. Data is the fuel of the ML flame, wet kindling will give shitty results.

There are a few things I like to look for in data munging tabular records:

1. **Overall size** - ideally this should be known before loading the data into memory and potentially an iterative approach to be designed using chunking.
2. **No. columns** - is our dimensionality huge? would removing a large number impact us? are there any highly correlated cols? what about synthetic variables?
3. **column types** - are we going to have trouble with certain fields (dates, non UTF-8 chars, serialized/nested fields, badly typed fields)
4. **column names** - is there a description of what's in that column? something I can sanity check with external data maybe? £50 house prices would raise alarms.
5. **Null/missing data** - how will we deal with these records? are the null records a large chunk of the data?

Ideally, this non-exhaustive list of checks should be completed upstream in our stack by tools such as [dbt](https://docs.getdbt.com/docs/introduction). As a Data scientist, I want to have a reproducible way of cleaning my data.

```python
df = pd.read_csv('data/kc_house_data.csv')
df.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 21613 entries, 0 to 21612
    Data columns (total 21 columns):
     #   Column         Non-Null Count  Dtype  
    ---  ------         --------------  -----  
     0   id             21613 non-null  int64  
     1   date           21613 non-null  object 
     2   price          21613 non-null  float64
     3   bedrooms       21613 non-null  int64  
     4   bathrooms      21613 non-null  float64
     5   sqft_living    21613 non-null  int64  
     6   sqft_lot       21613 non-null  int64  
     7   floors         21613 non-null  float64
     8   waterfront     21613 non-null  int64  
     9   view           21613 non-null  int64  
     10  condition      21613 non-null  int64  
     11  grade          21613 non-null  int64  
     12  sqft_above     21613 non-null  int64  
     13  sqft_basement  21613 non-null  int64  
     14  yr_built       21613 non-null  int64  
     15  yr_renovated   21613 non-null  int64  
     16  zipcode        21613 non-null  int64  
     17  lat            21613 non-null  float64
     18  long           21613 non-null  float64
     19  sqft_living15  21613 non-null  int64  
     20  sqft_lot15     21613 non-null  int64  
    dtypes: float64(5), int64(15), object(1)
    memory usage: 3.5+ MB

```python
df.sort_values('id').head()
```

<div>
<style scoped>
.dataframe tbody tr th:only-of-type {
vertical-align: middle;
}

    .dataframe tbody tr th {
        vertical-align: top;
    }
    
    .dataframe thead th {
        text-align: right;
    }

</style>

<table border="1" class="dataframe">
<thead>
<tr style="text-align: right;">
<th></th>
<th>id</th>
<th>date</th>
<th>price</th>
<th>bedrooms</th>
<th>bathrooms</th>
<th>sqft_living</th>
<th>sqft_lot</th>
<th>floors</th>
<th>waterfront</th>
<th>view</th>
<th>...</th>
<th>grade</th>
<th>sqft_above</th>
<th>sqft_basement</th>
<th>yr_built</th>
<th>yr_renovated</th>
<th>zipcode</th>
<th>lat</th>
<th>long</th>
<th>sqft_living15</th>
<th>sqft_lot15</th>
</tr>
</thead>
<tbody>
<tr>
<th>2497</th>
<td>1000102</td>
<td>20150422T000000</td>
<td>300000.0</td>
<td>6</td>
<td>3.00</td>
<td>2400</td>
<td>9373</td>
<td>2.0</td>
<td>0</td>
<td>0</td>
<td>...</td>
<td>7</td>
<td>2400</td>
<td>0</td>
<td>1991</td>
<td>0</td>
<td>98002</td>
<td>47.3262</td>
<td>-122.214</td>
<td>2060</td>
<td>7316</td>
</tr>
<tr>
<th>2496</th>
<td>1000102</td>
<td>20140916T000000</td>
<td>280000.0</td>
<td>6</td>
<td>3.00</td>
<td>2400</td>
<td>9373</td>
<td>2.0</td>
<td>0</td>
<td>0</td>
<td>...</td>
<td>7</td>
<td>2400</td>
<td>0</td>
<td>1991</td>
<td>0</td>
<td>98002</td>
<td>47.3262</td>
<td>-122.214</td>
<td>2060</td>
<td>7316</td>
</tr>
<tr>
<th>6735</th>
<td>1200019</td>
<td>20140508T000000</td>
<td>647500.0</td>
<td>4</td>
<td>1.75</td>
<td>2060</td>
<td>26036</td>
<td>1.0</td>
<td>0</td>
<td>0</td>
<td>...</td>
<td>8</td>
<td>1160</td>
<td>900</td>
<td>1947</td>
<td>0</td>
<td>98166</td>
<td>47.4444</td>
<td>-122.351</td>
<td>2590</td>
<td>21891</td>
</tr>
<tr>
<th>8411</th>
<td>1200021</td>
<td>20140811T000000</td>
<td>400000.0</td>
<td>3</td>
<td>1.00</td>
<td>1460</td>
<td>43000</td>
<td>1.0</td>
<td>0</td>
<td>0</td>
<td>...</td>
<td>7</td>
<td>1460</td>
<td>0</td>
<td>1952</td>
<td>0</td>
<td>98166</td>
<td>47.4434</td>
<td>-122.347</td>
<td>2250</td>
<td>20023</td>
</tr>
<tr>
<th>8809</th>
<td>2800031</td>
<td>20150401T000000</td>
<td>235000.0</td>
<td>3</td>
<td>1.00</td>
<td>1430</td>
<td>7599</td>
<td>1.5</td>
<td>0</td>
<td>0</td>
<td>...</td>
<td>6</td>
<td>1010</td>
<td>420</td>
<td>1930</td>
<td>0</td>
<td>98168</td>
<td>47.4783</td>
<td>-122.265</td>
<td>1290</td>
<td>10320</td>
</tr>
</tbody>
</table>
<p>5 rows × 21 columns</p>
</div>

Looks like our data is clean - we have 20 columns where only some don't make sense. All the values are numeric apart from date, which looks like a [ISO 8061](https://en.wikipedia.org/wiki/ISO_8601) string representation, which makes it easy for us to parse. Some of these can be classified as categories under the hood, so we could try [One Hot Encoding](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html) them later after a baseline is expected. There are lots of years in here that could also be better off converted to relative values, a zip code that's represented as a number and lat-long values which could be geo-aizied too. Location data as a concept is layered and in this case we may be better off ignoring some of them, well come to selecting data later. For now we are not going to touch the data other than the date to get it in the right format.

One thing to note is that this set of data contains multiple sales of the same house, for example house `1000102` which sold for $280,000 in 2014 then in 2015 for $300,000. This is something that should be incorporated into the model somehow, maybe in a synthetic field further down the line wrt the price - maybe some inflation adjusted value.

```python
df['date'] = pd.to_datetime(df['date'])
```

## Data Distribution

As I mentioned this is a very easy data source to begin with, and it's a nice sample to understand too. Everyone understands (apart from the market obviously, as a first time buyer) how a house should be valued at a high level; big => ££, beds => $$ location => €€.

```python
df.describe()
```

<div>
<style scoped>
.dataframe tbody tr th:only-of-type {
vertical-align: middle;
}

    .dataframe tbody tr th {
        vertical-align: top;
    }
    
    .dataframe thead th {
        text-align: right;
    }

</style>

<table border="1" class="dataframe">
<thead>
<tr style="text-align: right;">
<th></th>
<th>id</th>
<th>price</th>
<th>bedrooms</th>
<th>bathrooms</th>
<th>sqft_living</th>
<th>sqft_lot</th>
<th>floors</th>
<th>waterfront</th>
<th>view</th>
<th>condition</th>
<th>grade</th>
<th>sqft_above</th>
<th>sqft_basement</th>
<th>yr_built</th>
<th>yr_renovated</th>
<th>zipcode</th>
<th>lat</th>
<th>long</th>
<th>sqft_living15</th>
<th>sqft_lot15</th>
</tr>
</thead>
<tbody>
<tr>
<th>count</th>
<td>2.161300e+04</td>
<td>2.161300e+04</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>2.161300e+04</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
<td>21613.000000</td>
</tr>
<tr>
<th>mean</th>
<td>4.580302e+09</td>
<td>5.400881e+05</td>
<td>3.370842</td>
<td>2.114757</td>
<td>2079.899736</td>
<td>1.510697e+04</td>
<td>1.494309</td>
<td>0.007542</td>
<td>0.234303</td>
<td>3.409430</td>
<td>7.656873</td>
<td>1788.390691</td>
<td>291.509045</td>
<td>1971.005136</td>
<td>84.402258</td>
<td>98077.939805</td>
<td>47.560053</td>
<td>-122.213896</td>
<td>1986.552492</td>
<td>12768.455652</td>
</tr>
<tr>
<th>std</th>
<td>2.876566e+09</td>
<td>3.671272e+05</td>
<td>0.930062</td>
<td>0.770163</td>
<td>918.440897</td>
<td>4.142051e+04</td>
<td>0.539989</td>
<td>0.086517</td>
<td>0.766318</td>
<td>0.650743</td>
<td>1.175459</td>
<td>828.090978</td>
<td>442.575043</td>
<td>29.373411</td>
<td>401.679240</td>
<td>53.505026</td>
<td>0.138564</td>
<td>0.140828</td>
<td>685.391304</td>
<td>27304.179631</td>
</tr>
<tr>
<th>min</th>
<td>1.000102e+06</td>
<td>7.500000e+04</td>
<td>0.000000</td>
<td>0.000000</td>
<td>290.000000</td>
<td>5.200000e+02</td>
<td>1.000000</td>
<td>0.000000</td>
<td>0.000000</td>
<td>1.000000</td>
<td>1.000000</td>
<td>290.000000</td>
<td>0.000000</td>
<td>1900.000000</td>
<td>0.000000</td>
<td>98001.000000</td>
<td>47.155900</td>
<td>-122.519000</td>
<td>399.000000</td>
<td>651.000000</td>
</tr>
<tr>
<th>25%</th>
<td>2.123049e+09</td>
<td>3.219500e+05</td>
<td>3.000000</td>
<td>1.750000</td>
<td>1427.000000</td>
<td>5.040000e+03</td>
<td>1.000000</td>
<td>0.000000</td>
<td>0.000000</td>
<td>3.000000</td>
<td>7.000000</td>
<td>1190.000000</td>
<td>0.000000</td>
<td>1951.000000</td>
<td>0.000000</td>
<td>98033.000000</td>
<td>47.471000</td>
<td>-122.328000</td>
<td>1490.000000</td>
<td>5100.000000</td>
</tr>
<tr>
<th>50%</th>
<td>3.904930e+09</td>
<td>4.500000e+05</td>
<td>3.000000</td>
<td>2.250000</td>
<td>1910.000000</td>
<td>7.618000e+03</td>
<td>1.500000</td>
<td>0.000000</td>
<td>0.000000</td>
<td>3.000000</td>
<td>7.000000</td>
<td>1560.000000</td>
<td>0.000000</td>
<td>1975.000000</td>
<td>0.000000</td>
<td>98065.000000</td>
<td>47.571800</td>
<td>-122.230000</td>
<td>1840.000000</td>
<td>7620.000000</td>
</tr>
<tr>
<th>75%</th>
<td>7.308900e+09</td>
<td>6.450000e+05</td>
<td>4.000000</td>
<td>2.500000</td>
<td>2550.000000</td>
<td>1.068800e+04</td>
<td>2.000000</td>
<td>0.000000</td>
<td>0.000000</td>
<td>4.000000</td>
<td>8.000000</td>
<td>2210.000000</td>
<td>560.000000</td>
<td>1997.000000</td>
<td>0.000000</td>
<td>98118.000000</td>
<td>47.678000</td>
<td>-122.125000</td>
<td>2360.000000</td>
<td>10083.000000</td>
</tr>
<tr>
<th>max</th>
<td>9.900000e+09</td>
<td>7.700000e+06</td>
<td>33.000000</td>
<td>8.000000</td>
<td>13540.000000</td>
<td>1.651359e+06</td>
<td>3.500000</td>
<td>1.000000</td>
<td>4.000000</td>
<td>5.000000</td>
<td>13.000000</td>
<td>9410.000000</td>
<td>4820.000000</td>
<td>2015.000000</td>
<td>2015.000000</td>
<td>98199.000000</td>
<td>47.777600</td>
<td>-121.315000</td>
<td>6210.000000</td>
<td>871200.000000</td>
</tr>
</tbody>
</table>
</div>

```python
sns.heatmap(df.corr(), annot=True, fmt=".2f")
```

    <AxesSubplot:>

!\[svg\](file:///Users/toby.devlin/Downloads/house_prices/output_11_1.svg)

```python
sns.pairplot(df)
```

    <seaborn.axisgrid.PairGrid at 0x144295fa0>

```python
df.hist()
plt.tight_layout()
```

!\[svg\](file:///Users/toby.devlin/Downloads/house_prices/output_13_0.svg)

Eyeballing the columns look like everything looks fine, there are some distributions are clearly one sides such as the renovation year & waterfront, view and sqft_lot. Its worth looking into these a little more, see if they'll be useful. There are some clear correlations on some vars, ignoring the price column as that's our `y` column, looks like there are sqft to sqft columns and bathrooms to sqft. Ultimately these make sense, so we will continue without removing/altering any of these.

There are some that I'd like to look into in more depth, namely

* `sqft_lot` - why is this all bunched up at the 0 end?
* `waterfront` - what do these numbers mean?
* `view` - what do these numbers mean?
* `yr_renovated` - how does this impact us if we move to relative dates?

```python
df['sqft_lot'].unique()
```

    array([ 5650,  7242, 10000, ...,  5813,  2388,  1076])

ok looks like we do have some cats - though as they're encoded already ill just leave them. Next is to train a basic model as a baseline. As per the basic tutorial ill just use a decision tree as its relatively easy to understand.

## Running Experiments

We will run the following experiments:

1. The fist will use the default model with the original, relevant data.
2. We will then tune the hyper-parameters for the model.
3. Then we can apply some data transforms based on the decisions above and try steps 1) and 2) again.

Its worth noting, for now, we will only be doing [regression analysis](https://en.wikipedia.org/wiki/Regression_analysis) rather than [classification](https://en.wikipedia.org/wiki/Categorization). We could bucket the properties into categories then run a classifier on them, however that can be another post.

The prerequisites for doing this is to define our test/train splits and our model grading strategy, to ensure an accurate model. To do this I will define a function which can be reused.

```python
from sklearn.model_selection import train_test_split


def get_data(_df=df, seed=SEED):
    _dim_predict = ['price']
    _dim_features = list(
        # Typically, ill remove columns rather than add them together when the dimensionality is small
        set(df.columns) - set(_dim_predict) - {
            # this is just a unique id, as noted this means we may have multiple sales of the same house in the data
            'id',
        }
    )

    _x = _df[_dim_features]
    _y = _df[_dim_predict]

    # easy split of the data in a reproducible.
    _x_train, _x_test, _y_train, _y_test = train_test_split(_x, _y, random_state=seed)
    return _x_train, _x_test, _y_train, _y_test
```

When it comes to get the predictions we want to ensure we measure a relevant accuracy. There are lots of ways of doing this for regression, as discussed in [this post](https://stats.stackexchange.com/a/366824) and [in the sklearn docs](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics). Essentially the question is the same:

> how far away from the correct answer am I?

This means answering things like penalizing "distance" from the true result, by squaring, or just getting the absolute value of the distance and how to aggregate all our guesses, such as taking averages or min/max of our deltas. In my case, I'll try 3:

* [Mean Absolute Error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html) ($MAE$)
* [Max Error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.max_error.html) ($ME$)
* [Root Mean Squared Error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html) ($RMSE$)

Its worth noting this is just a way of comparing 2 arrays of the same length. We could go into lots of detail around skewness and how that impacts predictions on very expensive/cheap houses or the bulk of our data. Grading a regression model is really important for analysing what, exactly, you want to be predicting from a ML model.

In real terms this means "given all my guesses, how much did I miss the mark by if I were to guess the cost of the house?". For example if I had a $MAE$ of 50,000 I would interpret that as "given any price guess, I would be about 50,000 dollars off the mark"; a $RMSE$ is the same but would be calculated directly as errors are squared before averaging rather than just the abs value. A $ME$ would be just mean my guesses were within 50,000 dollars at all points, so that's the best upper bound I could expect (well kinda, this isn't the best analysis model). I'd expect the following:

$$
MAE < ME < RMSE
$$

I will also return the mean value of the true prices to compare how the model performance actually stacks up

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, max_error


def get_errors(y_true, y_predict):
    _mae = mean_absolute_error(y_true, y_predict)
    _me = max_error(y_true, y_predict)
    _rmse = mean_squared_error(y_true, y_predict, squared=False)
    mean = np.mean(y_true.values)
    return {
        'MAE': _mae,
        'MAE_ratio': _mae / mean,
        'ME': _me,
        'ME_ratio': _me / mean,
        'RMSE': _rmse,
        'RMSE_ratio': _rmse / mean,
        'y_true_mean': mean  # sanity check
    }
```

## Modeling

Step one, the basic Linear Regression. Probably going to not work super well as the data is likely non-linear

```python
from sklearn.linear_model import LinearRegression

# we expect numerical values for all dimensions
df_lr = df.copy()
df_lr['date'] = pd.to_numeric(df_lr['date'])  # this is converted to a unix timestamp

# Fetch our data to start
x_train, x_test, y_train, y_test = get_data(df_lr)

# training the model
linear_regressor = LinearRegression()
linear_regressor.fit(x_train, y_train)

# get a prediction result
y_pred = linear_regressor.predict(x_test)
linear_result = get_errors(y_test, y_pred)
linear_result
```

    {'MAE': 162853.06685450624,
     'MAE_ratio': 0.30260784392282614,
     'ME': 4157760.9363963753,
     'ME_ratio': 7.725805210862342,
     'RMSE': 238675.06028500642,
     'RMSE_ratio': 0.44349760668322247,
     'y_true_mean': 538165.3850851221}

results: `{'MAE': 162845.46915721806, 'ME': 4157289.8687455133, 'MSE': 56961700417.27493}` and there it is

From here lets try a bunch of other regression modeling techniques to see what the best default is.

```python
import time


# this is how we test a single model, and produce a set of metrics to be measured.
def do_basic_model_fitting(regressor):
    start = time.perf_counter_ns()

    _dt = df.copy()
    _dt['date'] = pd.to_numeric(_dt['date'])
    _x_train, _x_test, _y_train, _y_test = get_data(_dt)

    regressor.fit(_x_train, np.ravel(_y_train))

    _y_pred = regressor.predict(_x_test)
    return {'model': str(regressor).strip(), 'time_taken': (time.perf_counter_ns() - start),
            **get_errors(_y_test, _y_pred)}


# function for testing & aggregating multiple model tests
def model_testing(_models):
    test_results = []
    for model in models_1:
        res = do_basic_model_fitting(model)
        test_results.append(res)
    return pd.DataFrame(data=test_results)
```

```python
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor

# random_state is set with np.random.seed() in one of the top cells.
models_1 = [
    GaussianProcessRegressor(random_state=SEED),
    KNeighborsRegressor(),
    DecisionTreeRegressor(random_state=SEED),
    RandomForestRegressor(random_state=SEED),
    GradientBoostingRegressor(random_state=SEED),
    SVR(),
    MLPRegressor(random_state=SEED)
]

models_1_df = model_testing(models_1)
```

```python
# Add original OLS regression model results to the dataframe.
models_1_df = pd.concat(
    [models_1_df, pd.DataFrame([{'model': str(linear_regressor), **linear_result}])],
    ignore_index=True
)
```

```python
models_1_df['RMSE_rank'] = models_1_df['RMSE_ratio'].rank()
models_1_df.set_index('RMSE_rank', inplace=True)
models_1_df.sort_index()
```

<div>
<style scoped>
.dataframe tbody tr th:only-of-type {
vertical-align: middle;
}

    .dataframe tbody tr th {
        vertical-align: top;
    }
    
    .dataframe thead th {
        text-align: right;
    }

</style>

<table border="1" class="dataframe">
<thead>
<tr style="text-align: right;">
<th></th>
<th>model</th>
<th>time_taken</th>
<th>MAE</th>
<th>MAE_ratio</th>
<th>ME</th>
<th>ME_ratio</th>
<th>RMSE</th>
<th>RMSE_ratio</th>
<th>y_true_mean</th>
</tr>
<tr>
<th>RMSE_rank</th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<th>1.0</th>
<td>RandomForestRegressor(random_state=1234)</td>
<td>8.995612e+09</td>
<td>6.764377e+04</td>
<td>0.125693</td>
<td>2.573786e+06</td>
<td>4.782518</td>
<td>1.261181e+05</td>
<td>0.234348</td>
<td>538165.385085</td>
</tr>
<tr>
<th>2.0</th>
<td>GradientBoostingRegressor(random_state=1234)</td>
<td>2.714285e+09</td>
<td>7.599187e+04</td>
<td>0.141205</td>
<td>2.412803e+06</td>
<td>4.483386</td>
<td>1.321257e+05</td>
<td>0.245511</td>
<td>538165.385085</td>
</tr>
<tr>
<th>3.0</th>
<td>DecisionTreeRegressor(random_state=1234)</td>
<td>1.539032e+08</td>
<td>9.997077e+04</td>
<td>0.185762</td>
<td>2.375000e+06</td>
<td>4.413142</td>
<td>1.838886e+05</td>
<td>0.341695</td>
<td>538165.385085</td>
</tr>
<tr>
<th>4.0</th>
<td>LinearRegression()</td>
<td>NaN</td>
<td>1.628531e+05</td>
<td>0.302608</td>
<td>4.157761e+06</td>
<td>7.725805</td>
<td>2.386751e+05</td>
<td>0.443498</td>
<td>538165.385085</td>
</tr>
<tr>
<th>5.0</th>
<td>SVR()</td>
<td>1.045844e+10</td>
<td>2.194880e+05</td>
<td>0.407845</td>
<td>6.612500e+06</td>
<td>12.287115</td>
<td>3.619659e+05</td>
<td>0.672592</td>
<td>538165.385085</td>
</tr>
<tr>
<th>6.0</th>
<td>KNeighborsRegressor()</td>
<td>9.937745e+08</td>
<td>2.635385e+05</td>
<td>0.489698</td>
<td>6.581384e+06</td>
<td>12.229297</td>
<td>3.904825e+05</td>
<td>0.725581</td>
<td>538165.385085</td>
</tr>
<tr>
<th>7.0</th>
<td>GaussianProcessRegressor(random_state=1234)</td>
<td>2.787575e+10</td>
<td>5.380977e+05</td>
<td>0.999874</td>
<td>7.062500e+06</td>
<td>13.123289</td>
<td>6.425287e+05</td>
<td>1.193924</td>
<td>538165.385085</td>
</tr>
<tr>
<th>8.0</th>
<td>MLPRegressor(random_state=1234)</td>
<td>1.934091e+09</td>
<td>1.452784e+11</td>
<td>269951.244210</td>
<td>1.470485e+11</td>
<td>273240.370509</td>
<td>1.452819e+11</td>
<td>269957.667427</td>
<td>538165.385085</td>
</tr>
</tbody>
</table>
</div>

Looks like the defaults for a few models are much more effective than others. Namely, the Random Forrest model. Its worth looking at what each of these models actually does. I've selected models which take modeling from different paradigms to show that different approaches work better than others, and can depend on the underlying data set. In depth understanding of the model will help selection given a sets of data, the [sklearn docs](https://scikit-learn.org/stable/supervised_learning.html#supervised-learning) group supervised learning approaches quite well.

Looking at these models in more detail, descending wrt `RMSE_rank`, with default parameters:

### 8) Nural Networks - [MLPRegressor](https://scikit-learn.org/stable/modules/neural_networks_supervised.html#multi-layer-perceptron)

Nural networks are pretty advanced tools that are based on the concept of layers of neurons being connected together via activation functions. They typically need to be tuned pretty heavily; its no surprise that this model did the works with defaults. Typically, using more in depth libraries such as [Keras](https://keras.io/) or [PyTorch](https://pytorch.org/) are more suitable than SKLearns Multi Layer tool especially for more detailed models. This example is VERY off, thanks to the defaults provided.

### 7) Probabilistic - [GaussianProcessRegressor](https://scikit-learn.org/stable/modules/gaussian_process.html#gaussian-process-regression-gpr)

A Gaussian process is pretty heavyweight statistical tool to estimate a set of observations that assumes you can correlate them over multidimensional normal distibutions. To be honest I don't understand the process in much detail since I haven't studied classical statistics in much depth. Long story short, it's good at fitting when your dimensions are inherently related to these distributions and, while lacking accuracy in high dimensions, can be trained quickly with approximation methods.

### 6) Grouping - [KNeighborsRegressor](https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors)

Nearest neighbors algorithms try to locate other samples in the vector space that is represented by the dimensionality of the data. For example, we are using 19 dimensions at this point (as per the `get_data()` function). This means we are calculating a distance metric for all the records against all other records and keeping a select number of the closest ones to predict output value.

### 5) Support Vector Machines - [SVR](https://scikit-learn.org/stable/modules/svm.html#regression)

SVMs are really powerful tools that essentially split up your problem space into dimensions and draw a hyperplane across them, allowing you to divide or predict observations. They are incredibly powerful as they're not limited by dimensionality and can be [kernalized](https://en.wikipedia.org/wiki/Kernel_method) to enable any function to be used as predictors, making them many times more powerful than even transformed linear regression models. They do need to be trained in a more complex way than the defaults, which we will come on to.

### 4) Linear Model - [LinearRegression](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)

Its worth noting that this OLS model is a very simple regression and hence would not realistically be used unless the data is very simple. Many linear models can be generalized to produce [polynomial regression models](https://scikit-learn.org/stable/modules/linear_model.html#polynomial-regression-extending-linear-models-with-basis-functions), typically with some sort of transform. In this case I haven't tried any higher order regressions but there may be good reason to try as they're quick to fit and relationships in data rarely are linear and could be log/exp or even sin/tangential leading to quick wins; angular/geometric patterns are notoriusly hard to fix with these methods.

### 3) Tree Based - [DecisionTreeRegressor](https://scikit-learn.org/stable/modules/tree.html#regression)

Decision trees are understandable and intuitive as models go and can all be visualized as a result using [open source, graphviz, tooling](https://scikit-learn.org/stable/modules/generated/sklearn.tree.export_graphviz.html#sklearn.tree.export_graphviz). The way they are created is by splitting the feature space at sections defined by a loss function. This leads to some quick times to generate and is relative to the number of nodes needing training. Unfortunately they can be liable to under/over-fitting with the wrong hyper parameters so tuning & data balancing proir to fitting can be important. [This blog post](https://towardsdatascience.com/almost-everything-you-need-to-know-about-decision-trees-with-code-dc026172a284) has some superb detail.

### 2) Tree Based - [GradientBoostingRegressor](https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosting)

Gradient boosting sits in a type of models known as _boosting_ ensemble models, these take into account multiple predictors one by one to reduce model bias. Sort of like a recommendation algorithm for sub algorithms. The [default algorthm used for the heuristic](https://scikit-learn.org/stable/modules/ensemble.html#id16) is actually a decision tree, so it makes sense to have outperformed the single decision tree.

### 1) Tree based - [RandomForestRegressor](https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees)

This is another type of ensemble model, however this is of the second type, an _averaging_ model. It works by taking the average over multiple models. This seems to have worked the best due to the default parameters working very well for a baseline model. The concept of multiple decision trees, each with their own errors, being combined is the hope that these errors may cancel each other out over the course of many trees, forming a more accurate prediction.

Overall we have learned that the best way, for **simple** models, is combinations. However, I am convinced we can create a much more accurate regression model from some of the more simple predictors we have tried already with parameter tuning & data selection. Ideally this would be considered while making an informed decision from the data and maybe running a few heuristic appropriators for model selection. Ultimately the flow of ML engineers should follow a similar pattern:

1. Solution space is well-defined with success metrics
2. Data is ingested
3. Data is analysed and munging steps defined
4. Initial model testing

* Intelligent selection of model types trialed
* Synthetic fields created where it makes sense
* Model hyperparameter tuning and cross validations applied

1. Downstream marts produced with clear tests, cleaning and synthetic fields replicated
2. Production Models trained & versioned artefacts produced
3. Models deployed and monitored

Overall, of this long list, we were mostly focused on the first 4 stages; which makes sense. This post makes use of understanding models and reflections of these basic understandings on predictions. The next stage will be to really start completing the models and narrowing down on a production-able model. To do this I'd like to apply this to previous models/data in this post and also look to find data which would be valuable to analyse in the wider world.

Next big learning: https://www.kaggle.com/learn/intro-to-deep-learning