import {
  SET_AWS_PASSWORD,
  SET_EMAIL,
  SET_MY_ALERTS,
  SET_MY_FRIENDS,
  SET_MY_SESSIONS,
} from "../../constants";
import { User } from "../../interfaces";

export const INITIAL_STATE: User = {
  email: "",
  awsPassword: "",
  mySessions: [],
  myFriends: [],
  myAlerts: [],
};

export const user = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_AWS_PASSWORD:
      return { ...state, awsPassword: action.payload };
    case SET_MY_SESSIONS:
      return { ...state, mySessions: action.payload };
    case SET_MY_ALERTS:
      return { ...state, myAlerts: action.payload };
    case SET_MY_FRIENDS:
      return { ...state, myFriends: action.payload };
    default:
      return state;
  }
};

export default user;
