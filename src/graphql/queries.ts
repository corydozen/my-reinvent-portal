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
