import React, { useState } from "react";
import { Card, Container, Col, Row, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ReduxState } from "../interfaces";
import Alert from "./Alert";

const Dashboard = () => {
  const [showNewAlert, setShowNewAlert] = useState<boolean>(false);
  const [newAlertAlertType, setNewAlertAlertType] = useState<string>("");
  const [newAlertUpdateOrNew, setNewAlertUpdateOrNew] = useState<string>("");
  const [newAlertJoinParametersWith, setNewAlertJoinParametersWith] =
    useState<string>("");
  const sessions = useSelector((state: ReduxState) => state.user.mySessions);
  const alerts = useSelector((state: ReduxState) => state.user.myAlerts);
  return (
    <Container style={{ maxWidth: "100%" }}>
      <Row>
        <Col>
          <h2>My Alerts</h2>
          {alerts.map(alert => (
            <Alert alert={alert}></Alert>
          ))}
          {showNewAlert ? (
            <Card>
              <div className="card-body">
                <h4 className="card-title">New Alert</h4>
                <div className="card-text">
                  <Container>
                    <Row>
                      <Col>Alert Type</Col>
                      <Col>
                        <select
                          id="inputGroupSelect01"
                          onChange={e => setNewAlertAlertType(e.target.value)}
                          value={newAlertAlertType}
                        >
                          <option selected>Choose...</option>
                          <option value="sessionIdEquals">
                            Specific Session ID
                          </option>
                          <option value="sessionIdStartsWith">
                            Session ID Starts With
                          </option>
                          <option value="time">Time Based</option>
                          <option value="sessionType">By Session Type</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>On Updates Or New Sessions</Col>
                      <Col>
                        <select
                          id="inputGroupSelect01"
                          onChange={e => setNewAlertUpdateOrNew(e.target.value)}
                          value={newAlertUpdateOrNew}
                        >
                          <option selected>Choose...</option>
                          <option value="update">Updates</option>
                          <option value="new">New</option>
                          <option value="both">Both</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>Join Parameters With</Col>
                      <Col>
                        <select
                          id="inputGroupSelect01"
                          onChange={e =>
                            setNewAlertJoinParametersWith(e.target.value)
                          }
                          value={newAlertJoinParametersWith}
                        >
                          <option selected>Choose...</option>
                          <option value="and">And</option>
                          <option value="or">Or</option>
                        </select>
                      </Col>
                    </Row>
                    {newAlertAlertType === "sessionIdEquals" && (
                      <Row>
                        <Col>Session ID</Col>
                      </Row>
                    )}
                  </Container>
                </div>
              </div>
            </Card>
          ) : (
            <Button onClick={() => setShowNewAlert(true)}>New Alert</Button>
          )}
        </Col>
        <Col>
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
                    <h4 className="card-title">{session.name}</h4>
                    <h5 className="card-subtitle mb-2 text-muted">
                      {startTime.toLocaleDateString("en-US", options)}
                    </h5>
                    <h6>{session.sessionType}</h6>
                    <div className="card-text">{session.description}</div>
                  </div>
                </Card>
              );
            })}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
