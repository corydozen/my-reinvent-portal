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
export interface Session {
  action?: "NO_SEATING" | "NO_CAPACITY" | "RESERVABLE" | "WAITLISTABLE";
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
  level: "intermediate" | "advanced" | null;
  location: string | null;
  myReservationStatus: string;
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
  package: string | null;
  price: number | null;
  room: Room;
  sessionType: {
    name: string;
  };
  tracks: string[];
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
export interface QueryBody {
  input: {
    eventId: string;
    maxResults: number;
    nextToken?: string | null;
  };
}
