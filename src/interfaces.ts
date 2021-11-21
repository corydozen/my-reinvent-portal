export interface ReduxState {
  user: User;
}

export interface User {
  email: string;
  awsPassword: string;
  mySessions: Session[];
  myFriends: Friend[];
  myAlerts: Alert[];
}

export interface DbGetMeReturn {
  PK: string;
  SK: string;
  email: string;
  awsPassword: string;

  action: string;
  alias: string;
  createdAt: number;
  description: string;
  duration: number;
  endTime: number;
  isConflicting: string;
  isEmbargoed: boolean;
  isFavoritedByMe: boolean;
  isPaidSession: boolean;
  level: string;
  location: string;
  myReservationStatus: string;
  name: string;
  sessionId: string;
  startTime: number;
  status: string;
  type: string;
  capacities: string;
  customFieldDetails: string;
  package: string;
  price: string;
  room: string;
  sessionType: string;
  track: string;

  alertType: AlertType;
  parameters: string;
  joinParametersWith: AlertJoinParametersWithType;
  updateOrNew: AlertUpdateOrNewType;

  original: boolean;
}

export interface Session {
  sessionId: string;
  action?: string;
  alias?: string;
  createdAt?: number;
  description: string;
  duration: number;
  endTime: number;
  isConflicting?: string;
  isEmbargoed?: boolean;
  isFavoritedByMe?: boolean;
  isPaidSession?: boolean;
  level?: string;
  location?: string;
  myReservationStatus?: string;
  name: string;
  startTime: number;
  status?: string;
  type?: string;
  capacities?: string;
  customFieldDetails?: string;
  package?: string;
  price?: string;
  room: string;
  sessionType: string;
  track?: string;
}
export type AlertType = "sns" | "autoregister";
export type AlertJoinParametersWithType = "and" | "or";
export type AlertUpdateOrNewType = "update" | "new" | "both";
export type AlertParameterType =
  | "sessionIdEquals"
  | "sessionIdStartsWith"
  | "time"
  | "sessionType";
export interface DbAlert {
  PK: string;
  SK: string;
  alertType: AlertType;
  parameters: string;
}
//{ "classId": { "startswith": "svs"}, "datetime": { "after": "2021-11-29 09:00" }, "datetime: { "before": "2021-11-29 13:00"} }
export interface TimeParameters {
  before?: string;
  after?: string;
}
export interface AlertParameter {
  parameterType?: AlertParameterType;
  parameterData?: string | TimeParameters;
}
export interface Alert {
  id: string;
  alertType: AlertType;
  updateOrNew: AlertUpdateOrNewType;
  parameters: AlertParameter[];
  joinParametersWith: AlertJoinParametersWithType;
}

export interface Friend {
  email: string;
  status: string;
  requestedBy: "me" | "notme";
}

export interface UpdateAlertInputType {
  id?: string;
  alertType: string;
  updateOrNew: string;
  parameters: string;
  joinParametersWith: string;
  emailAddress: string;
}

export interface DeleteAlertInputType {
  id: string;
}
