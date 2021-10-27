# AWS Re:invent Portal Re:invented

## Initial Deployment

1. Create a new AWS Organization
1. Create a new IAM User with Admin Access to the new Organization
1. Register that user as a profile in your `~/.aws/credentials` file. I named my profile `portal-reinvented`. If you choose a different name, you may have to update some pieces of the architecture to get them to work
1. `mkdir build`
1. `npx cdk bootstrap aws://1234567890/us-east-1` <- Plug in your account number
1. `cp cdk/config.example.ts cdk/config.ts`
1. Open up that new config.ts file and enter an email address you control. You can also change the project name if you like
1. Visit the [SES Console](https://console.aws.amazon.com/ses/home?region=us-east-1#) in your browser.
1. Click on "Verify a New Email Address" and enter that same email address that you control from above.
1. Open your email and click on the verification link
1. `chmod +x bin/deploy.sh`
1. `./bin/deploy.sh PersonalReinventBot2021 portal-reinvented` <- The first parameter is the project name you chose in your `cdk/config.ts` file. The second parameter is the profile name you chose above.
