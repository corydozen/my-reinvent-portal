import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import schedules from "./schedule";
import user from "./user";

export const reducers = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    user,
    schedules,
  });

export default reducers;
