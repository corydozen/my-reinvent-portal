import React from "react";
import { Card, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ReduxState } from "../interfaces";

const Dashboard = () => {
  const sessions = useSelector((state: ReduxState) => state.user.mySessions);

  return (
    <Container style={{ maxWidth: "100%" }}>
      <h2>My Registered Sessions</h2>
      {sessions
        .sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
        .map(session => {
          let startTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
          startTime.setUTCSeconds(session.startTime / 1000);
          const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
          };
          return (
            <Card key={session.sessionId}>
              <div className="card-body">
                <h5 className="card-title">{session.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {startTime.toLocaleDateString("en-US", options)}
                </h6>
                <div className="card-text">{session.description}</div>
              </div>
            </Card>
          );
        })}
      <Card>second card</Card>
    </Container>
  );
};

export default Dashboard;
