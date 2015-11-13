# Performance testing for Liveblog3 client

## Installation

```
npm install
service selenium start
```

## Usage

```
node server.js --url=http://liveblog-test-eu-west-12.s3-eu-west-1.amazonaws.com/blogs/55fa9e3de95d73002ef2931b/index.html
```

the results in a tab separated format to be easly added in excel.

## Options

Parameters | Description | Default value
-----------|-------------|--------------
`URL` | lb url of the embed to test.