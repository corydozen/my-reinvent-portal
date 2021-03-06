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
1. After deploying, create a user for yourself with the email address that you put in the `cdk/config.ts` file. Find that new user's sub in cognito and add that to your `cdk/config.ts` file as well

## If you only change cdk stuff

cd cdk && yarn build && npx cdk synth && npx cdk deploy --all --profile portal-reinvented --require-approval never && cd ..

## Setting up CodeBuild

1. [Create a github Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Make sure it has the proper scopes [listed here](https://docs.aws.amazon.com/codebuild/latest/userguide/access-tokens.html).
1. Create a new [Secret](https://console.aws.amazon.com/secretsmanager/home?region=us-east-1#!/home).
1. Enter your Personal Access Token as the value and choose a meaningful key. I chose `githubOauthToken`
1. Choose a meaningful name for the secret. I chose `githubOauthTokenSecret`.
1. Ensure that the names you chose are in your `cdk/config.ts` file.
1. Update the repo, owner, and branch entries in the `cdk/config.ts` file to reflect your setup.
1. `cd cdk && yarn build && npx cdk synth && npx cdk deploy PersonalReinventBot2021CodeBuild --require-approval never --profile portal-reinvented` Obviously, put your profile and your stack name in there.

## Notes

### Optimization Attempts

#### Remove .ts files from lambda

The `lambda.Code.fromAsset` call can exclude files. As a quick win, I'm excluding `.ts` files. That's a good savings. There's probably more I could do there.

#### Separate node_modules folders for dev and prod (failed)

I moved the `cdk/assets` folder to be `backendassets` instead. This is so that I can have a `yarn --prod` version of `node_modules` inside those function folders, and still run `cd cdk && npx tsc`. If the assets folder is under the cdk folder and doesn't include its devDependencies, typescript will barf.
But then I moved it back because I'd have to install and maintain `tsc` inside each lambda.
Perhaps I could figure out a way to have different node_modules folders for prod vs dev for each lambda. Doing a `yarn && cd ../../cdk && yarn build && cd lambda/fn && rm -rf node_modules && yarn --prod` for each deploy is not sustainable.
Well, that might not work either. Running `cd cdk && yarn build` doesn't work when I've got extra node_modules folders. I get a "JavaScript heap out of memory" error.
I tried upgrading to yarn 2. That was a debacle. It required me to put some .yarnrc file in the repo and a .yarn folder with some massive js file in it. Plus, it upgraded me directly to yarn 3. So the `yarn workspaces focus --prodction` cmd didn't work. Ugh.
