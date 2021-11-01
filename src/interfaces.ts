export interface ReduxState {
  user: User;
}

export interface User {
  email: string;
  awsPassword: string;
}

export interface DbUser {
  PK: string;
  SK: string;
  email: string;
  awsPassword: string;
}
