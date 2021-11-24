import { SET_SCHEDULE } from "../../constants";
import { Schedule } from "../../interfaces";

export const INITIAL_STATE: Schedule[] = [];

export const schedules = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case SET_SCHEDULE:
      return action.payload;
    default:
      return state;
  }
};

export default schedules;
