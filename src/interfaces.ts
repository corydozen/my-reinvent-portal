export interface ReduxState {
  user: User;
}

export interface User {
  email: string;
  awsPassword: string;
  mySessions: Session[];
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
  isEmbargoed: Boolean;
  isFavoritedByMe: Boolean;
  isPaidSession: Boolean;
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

  alertType: string;
  parameters: string;
  joinParametersWith: string;
}

export interface DbSession {
  PK: string;
  SK: string;
  action: string;
  alias: string;
  createdAt: number;
  description: string;
  duration: number;
  endTime: number;
  isConflicting: string;
  isEmbargoed: Boolean;
  isFavoritedByMe: Boolean;
  isPaidSession: Boolean;
  level: string;
  location: string;
  myReservationStatus: string;
  name: string;
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
  isEmbargoed?: Boolean;
  isFavoritedByMe?: Boolean;
  isPaidSession?: Boolean;
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
export interface DbAlert {
  PK: string;
  SK: string;
  alertType: AlertType;
  parameters: string;
}
//{ "classId": { "startswith": "svs"}, "datetime": { "after": "2021-11-29 09:00" }, "datetime: { "before": "2021-11-29 13:00"} }
export interface TimeParameters {
  before?: Date;
  after?: Date;
}
export interface AlertParameter {
  parameterType:
    | "sessionIdEquals"
    | "sessionIdStartsWith"
    | "time"
    | "sessionType";
  parameterData: string | TimeParameters;
}
export interface Alert {
  id: string;
  alertType: AlertType;
  parameters: AlertParameter[];
  joinParametersWith: "and" | "or";
}

export interface Friend {
  email: string;
  status: string;
}
