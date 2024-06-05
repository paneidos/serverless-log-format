# Serverless Log Format

This plugin allows you to specify the log format/level of your functions.

## Global

You can define the properties globally in your `serverless.yml`
```
provider::
  name: aws
  runtime: python3.12
  logFormat: JSON
  logLevel: DEBUG
  systemLogLevel: WARN
```

## Per function

Or per function:
```
functions:
  hello:
    handler: hello.handler
    logFormat: JSON
    logLevel: DEBUG
    systemLogLevel: WARN
```
