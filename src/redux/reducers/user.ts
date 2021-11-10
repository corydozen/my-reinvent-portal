import { SET_AWS_PASSWORD, SET_EMAIL, SET_MY_SESSIONS } from "../../constants";
import { User } from "../../interfaces";

export const INITIAL_STATE: User = {
  email: "",
  awsPassword: "",
  mySessions: [],
};

export const user = (
  state = INITIAL_STATE,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_AWS_PASSWORD:
      return { ...state, awsPassword: action.payload };
    case SET_MY_SESSIONS:
      return { ...state, mySessions: action.payload };
    default:
      return state;
  }
};

export default user;
