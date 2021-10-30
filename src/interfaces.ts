export interface ReduxState {
  user: User;
}

export interface User {
  email: string;
  awsPassword: string;
}
