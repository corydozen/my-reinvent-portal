export const savePassword = `mutation SavePassword($password: String) {
  savePassword (awsPassword: $password) {
    PK
    SK
    email
    awsPassword
  }
}`;

export const refreshMySessions = `mutation RefreshMySessions {
  refreshMySessions {
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
