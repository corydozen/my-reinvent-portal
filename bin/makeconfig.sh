echo "export const config = {
  proj: \"$proj\",
  region: \"$region\",
  sub: \"$sub\",
  emailAddress: \"$emailAddress\",
  reinventCognitoPoolId: \"$reinventCognitoPoolId\",
  reinventCognitoClientId: \"$reinventCognitoClientId\",
  reinventAppsyncUrl:
    \"$reinventAppsyncUrl\",
  repo: \"$repo\",
  owner: \"$owner\",
  secretName: \"$secretName\",
  githubOauthTokenKey: \"$githubOauthTokenKey\",
  branch: \"$branch\",
};" > cdk/config.ts