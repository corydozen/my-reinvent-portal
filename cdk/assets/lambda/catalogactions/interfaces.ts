export interface CustomField {
  name: string;
  type: string;
  visibility: string;
  fieldId: string;
  values: {
    fieldOptionId: string;
    name: string;
  }[];
}
export interface Room {
  name: string | null;
  venue: string | null;
}
export interface Package {
  itemId: string;
}
export interface Price {
  currency: string;
  value: number;
}
export interface Track {
  name: string;
}
export interface Session {
  action?:
    | "NO_SEATING"
    | "NO_CAPACITY"
    | "RESERVABLE"
    | "RESERVED"
    | "WAITLISTABLE";
  alias: string;
  createdAt: number;
  description: string;
  duration: number;
  endTime: number | null;
  eventId: string;
  isConflicting?: {
    reserved: Session[];
    waitlisted: Session[];
  };
  isEmbargoed: boolean | null;
  isFavoritedByMe: boolean | null;
  isPaidSession: boolean | null;
  level: "intermediate" | "advanced" | "expert" | null;
  location: string | null;
  myReservationStatus: "NONE" | "RESERVED" | "WAITLISTED";
  name: string;
  sessionId: string;
  startTime: number;
  status: string;
  type: string;
  capacities: {
    reservableRemaining: number;
    waitlistRemaining: number;
  };
  customFieldDetails: CustomField[];
  package: Package | null;
  price: Price | null;
  room: Room;
  sessionType: {
    name: string;
  };
  tracks: Track[];
}
export interface ListSessionsResult {
  data: {
    listSessions: {
      results: Session[];
      totalCount: number;
      nextToken: string | null;
    };
  };
}
export interface ListSessionsInput {
  input: {
    eventId: string;
    maxResults: number;
    nextToken?: string | null;
  };
}
