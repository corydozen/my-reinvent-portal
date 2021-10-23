# Personal Reinvent Portal

This was inspired by https://github.com/mda590/reinvent_bot.

## Installation

1. `cd cdk`
1. `yarn`
1. `npx cdk synth`
1. `npx cdk deploy`

Use this code as a baseline, but do it differently

cdk
dynamodb
dynamodb streams
sns
lambda
cloudwatch rule

Run the cloudwatch rule every 5 minutes to grab the catalog
Insert/Update records in the dynamodb table appropriately
Triggers on the dynamodb table feed into dynamodb streams
Lambda receives the stream data and discerns whether to send an SNS message
Outstanding item - how to register a requested SNS. Example: New classes that start with SVS or Updated classes that I am registered for. Maybe it could start out as a json config file
SNS Subscribers
Email
SMS
Lambda - send tweet
