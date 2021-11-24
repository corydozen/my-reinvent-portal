const getMeReturnFields = `
    PK
    SK
    GSI1PK
    GSI1SK
    email
    awsPassword

    action
    alias
    createdAt
    description
    duration
    endTime
    isConflicting
    isEmbargoed
    isFavoritedByMe
    isPaidSession
    level
    location
    myReservationStatus
    name
    sessionId
    startTime
    status
    type
    capacities
    customFieldDetails
    package
    price
    room
    sessionType
    track

    alertType
    parameters
    joinParametersWith
    updateOrNew

    original`;
export const getMe = `query GetMe {
  getMe {${getMeReturnFields}
  }
}`;

export const getMyGsiFriends = `query GetMyGsiFriends {
  getMyGsiFriends {${getMeReturnFields}
  }
}`;

export const getMySessions = `query GetMySessions {
  getMySessions {
    PK
    SK
    action
    alias
    createdAt
    description
    duration
    endTime
    isConflicting
    isEmbargoed
    isFavoritedByMe
    isPaidSession
    level
    location
    myReservationStatus
    name
    sessionId
    startTime
    status
    type
    capacities
    customFieldDetails
    package
    price
    room
    sessionType
    track
  }
}`;

export const getOverview = `query GetOverview {
  getOverview {
    everybody
  }
}`;

export const getSchedule = `query GetSchedule($getScheduleInput: GetScheduleInput) {
  getSchedule (getScheduleInput: $getScheduleInput) {
    PK
    SK
    name
    sessionId
    startTime
    duration
    room
    sessionType
  }
}`;
