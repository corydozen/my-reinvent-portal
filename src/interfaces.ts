export interface ReduxState {
  user: User;
}

export interface User {
  email: string;
  awsPassword: string;
  mySessions: Session[];
}

export interface DbUser {
  PK: string;
  SK: string;
  email: string;
  awsPassword: string;
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
  sessionsType: string;
  track: string;
}
export interface Session {
  sessionId: string;
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
  sessionsType: string;
  track: string;
}
