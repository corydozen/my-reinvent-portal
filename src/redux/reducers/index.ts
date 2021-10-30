import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import user from "./user";

export const reducers = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    user,
  });

export default reducers;
