import { SET_SCHEDULE } from "../constants";
import { DbSchedule, Schedule } from "../interfaces";

export const setSchedule = (dbSchedules: DbSchedule[]) => {
  const schedules: Schedule[] = dbSchedules.map(dbSchedule => ({
    email: dbSchedule.email,
    sessions: dbSchedule.sessions.map(dbSession => ({
      ...dbSession,
      sessionId: dbSession.SK.substring(dbSession.SK.indexOf("#", 8) + 1),
    })),
  }));
  return { type: SET_SCHEDULE, payload: schedules };
};
