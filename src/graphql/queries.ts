export const getMe = `query GetMe {
  getMe {
    PK
    SK
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
    sessionsType
    track
  }
}`;
