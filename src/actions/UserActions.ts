import { SET_EMAIL, SET_AWS_PASSWORD, SET_MY_SESSIONS } from "../constants";
import { DbSession, Session } from "../interfaces";

export const setEmail = (email: string) => {
  return { type: SET_EMAIL, payload: email };
};

export const setAwsPassword = (awsPassword: string) => {
  return { type: SET_AWS_PASSWORD, payload: awsPassword };
};

export const setMySessions = (dbSessions: DbSession[]) => {
  const sessions: Session[] = dbSessions.map(dbSession => ({
    ...dbSession,
    sessionId: dbSession.SK.substring(dbSession.SK.indexOf("#", 7)),
  }));
  return { type: SET_MY_SESSIONS, payload: sessions };
};
