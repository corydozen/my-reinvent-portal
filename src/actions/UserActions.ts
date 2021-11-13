import {
  SET_EMAIL,
  SET_AWS_PASSWORD,
  SET_MY_SESSIONS,
  SET_MY_FRIENDS,
  SET_MY_ALERTS,
} from "../constants";
import {
  Alert,
  AlertParameter,
  AlertType,
  DbGetMeReturn,
  Friend,
  Session,
} from "../interfaces";

export const setEmail = (email: string) => {
  return { type: SET_EMAIL, payload: email };
};

export const setAwsPassword = (awsPassword: string) => {
  return { type: SET_AWS_PASSWORD, payload: awsPassword };
};

export const setMySessions = (dbSessions: DbGetMeReturn[]) => {
  const sessions: Session[] = dbSessions.map(dbSession => ({
    ...dbSession,
    sessionId: dbSession.SK.substring(dbSession.SK.indexOf("#", 8) + 1),
  }));

  return { type: SET_MY_SESSIONS, payload: sessions };
};

export const setMyFriends = (dbFriends: DbGetMeReturn[], sub: string) => {
  const friends: Friend[] = dbFriends.map(dbFriend => ({
    status: dbFriend.status,
    email: dbFriend.SK.substring(dbFriend.SK.indexOf("#") + 1),
    requestedBy:
      dbFriend.PK.substring(dbFriend.PK.indexOf("#") + 1) === sub
        ? "me"
        : "notme",
  }));
  return { type: SET_MY_FRIENDS, payload: friends };
};

export const setMyAlerts = (dbAlerts: DbGetMeReturn[]) => {
  const alerts: Alert[] = dbAlerts.map(dbAlert => ({
    ...dbAlert,
    id: dbAlert.SK.substring(dbAlert.SK.indexOf("#") + 1),
    alertyType: dbAlert.alertType as AlertType,
    parameters: JSON.parse(dbAlert.parameters) as AlertParameter[],
  }));
  return { type: SET_MY_ALERTS, payload: alerts };
};
