export const savePassword = `mutation SavePassword($password: String) {
  savePassword (awsPassword: $password) {
    PK
    SK
    email
    awsPassword
  }
}`;
