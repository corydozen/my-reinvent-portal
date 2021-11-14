// This is the info for the portal cognito instance
export const config = {
  apiurl: "https://api.us-east-1.prod.events.aws.a2z.com/attendee/graphql",
  UserPoolClientId: "2h40eam2atft40g0c3mlg0aei1",
  UserPoolId: "us-east-1_Xuc1O0biz",
  region: "us-east-1",
};

export const sessionTypes = [
  "Breakout Session",
  "Builders' Session",
  "Bootcamp",
  "Leadership Session",
  "Chalk Talk",
  "Workshop",
  "Jam",
  "Builders' Fair",
  "Meals",
  "Lab",
  "Quirky Event",
  "Other",
  "Demo Theater",
  "Lounge",
  "Lightning Talk- Executive Summit",
  "Analyst Summit",
  "Press",
  "Keynotes",
  "Marquee Session- Executive Summit",
  "AWS Staff",
  "GameDay",
  "Partner Theater",
  "Ask a Strategist- Executive Summit",
  "Lightning Talk",
];

export const SET_EMAIL = "SET_EMAIL";
export const SET_AWS_PASSWORD = "SET_AWS_PASSWORD";
export const SET_MY_SESSIONS = "SET_MY_SESSIONS";
export const SET_MY_FRIENDS = "SET_MY_FRIENDS";
export const SET_MY_ALERTS = "SET_MY_ALERTS";
