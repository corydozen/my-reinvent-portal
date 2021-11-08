echo "export const config = {
  proj: \"$proj\",
  region: \"$region\",
  sub: \"$sub\",
  emailAddress: \"$emailAddress\",
  reinventCognitoPoolId: \"$reinventCognitoPoolId\",
  reinventCognitoClientId: \"$reinventCognitoClientId\",
  reinventAppsyncUrl:
    \"$reinventAppsyncUrl\",
};" > cdk/config.ts