import { SET_EMAIL, SET_AWS_PASSWORD } from "../constants";

export const setEmail = (email: string) => {
  return { type: SET_EMAIL, payload: email };
};

export const setAwsPassword = (awsPassword: string) => {
  return { type: SET_AWS_PASSWORD, payload: awsPassword };
};
