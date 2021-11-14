import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { sessionTypes } from "../constants";
import {
  AlertParameter,
  AlertParameterType,
  ReduxState,
  TimeParameters,
} from "../interfaces";
import Alert from "./Alert";

const Dashboard = () => {
  const [showNewAlert, setShowNewAlert] = useState<boolean>(false);
  const [newAlertUpdateOrNew, setNewAlertUpdateOrNew] = useState<string>("");
  const [newAlertJoinParametersWith, setNewAlertJoinParametersWith] =
    useState<string>("");
  const [newParameterType, setNewParameterType] =
    useState<AlertParameterType | null>(null);
  const [sessionIdEqualsParameterValue, setSessionIdEqualsParameterValue] =
    useState<string>("");
  const [
    sessionIdStartsWithParameterValue,
    setSessionIdStartsWithParameterValue,
  ] = useState<string>("");
  const [timeBefore, setTimeBefore] = useState<string>("");
  const [timeAfter, setTimeAfter] = useState<string>("");
  const [timeType, setTimeType] = useState<string>("between");
  const [sessionTypeParameterValue, setSessionTypeParameterValue] =
    useState<string>("");
  const [newAlertParameters, setNewAlertParameters] = useState<
    AlertParameter[]
  >([]);
  const sessions = useSelector((state: ReduxState) => state.user.mySessions);
  const alerts = useSelector((state: ReduxState) => state.user.myAlerts);
  const resetParameters = () => {
    setNewParameterType(null);
    setSessionIdEqualsParameterValue("");
    setSessionIdStartsWithParameterValue("");
    setTimeBefore("");
    setTimeAfter("");
    setSessionTypeParameterValue("");
  };
  const addParameter = () => {
    if (newParameterType !== null && newParameterType !== undefined) {
      let parameterData: string | TimeParameters;
      switch (newParameterType) {
        case "sessionIdEquals":
          parameterData = sessionIdEqualsParameterValue;
          break;
        case "sessionIdStartsWith":
          parameterData = sessionIdStartsWithParameterValue;
          break;
        case "sessionType":
          parameterData = sessionTypeParameterValue;
          break;
        case "time":
          parameterData = {
            after: timeAfter,
            before: timeBefore,
          };
          break;
        default:
          parameterData = "";
      }
      const tempParameters = [...newAlertParameters];
      tempParameters.push({
        parameterType: newParameterType,
        parameterData,
      });
      setNewAlertParameters(tempParameters);
      resetParameters();
    }
  };
  const removeParameter = (i: number) => {
    let tempParameters = [...newAlertParameters];
    tempParameters.splice(i, 1);
    setNewAlertParameters(tempParameters);
  };
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
                    {newAlertParameters.map((p, i) => (
                      <Card key={i}>
                        <div className="card-body">
                          <div className="card-text">
                            <Container>
                              <Row>
                                <Col>Type</Col>
                                <Col>{p.parameterType}</Col>
                                <Col>
                                  <Button
                                    className="btn-danger"
                                    onClick={() => removeParameter(i)}
                                  >
                                    Remove
                                  </Button>
                                </Col>
                              </Row>
                              <Row>
                                <Col>Parameter(s)</Col>
                                <Col>
                                  {p.parameterType === "time"
                                    ? JSON.stringify(p.parameterData)
                                    : p.parameterData}
                                </Col>
                                <Col>&nbsp;</Col>
                              </Row>
                            </Container>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Container>
                      <h5>New Parameter</h5>
                      <Row>
                        <Col>Parameter Type</Col>
                        <Col>
                          <select
                            id="inputGroupSelect01"
                            onChange={e =>
                              setNewParameterType(
                                e.target.value as AlertParameterType
                              )
                            }
                            value={newParameterType || ""}
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
                      {newParameterType === "sessionIdEquals" && (
                        <Row>
                          <Col>Session ID</Col>
                          <Col>
                            <input
                              value={sessionIdEqualsParameterValue}
                              onChange={e =>
                                setSessionIdEqualsParameterValue(e.target.value)
                              }
                            />
                          </Col>
                        </Row>
                      )}
                      {newParameterType === "sessionIdStartsWith" && (
                        <Row>
                          <Col>Session ID Starts With</Col>
                          <Col>
                            <input
                              value={sessionIdStartsWithParameterValue}
                              onChange={e =>
                                setSessionIdStartsWithParameterValue(
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                        </Row>
                      )}
                      {newParameterType === "time" && (
                        <>
                          <Row>
                            <Col>Type</Col>
                            <Col>
                              <select
                                value={timeType}
                                onChange={e => setTimeType(e.target.value)}
                              >
                                <option value="between">Between</option>
                                <option value="before">Before</option>
                                <option value="after">After</option>
                              </select>
                            </Col>
                          </Row>
                          {(timeType === "between" || timeType === "after") && (
                            <Row>
                              <Col>After</Col>
                              <Col>
                                <input
                                  placeholder="2021-12-01 11:15:00"
                                  value={timeAfter}
                                  onChange={e => setTimeAfter(e.target.value)}
                                />
                              </Col>
                            </Row>
                          )}
                          {(timeType === "between" ||
                            timeType === "before") && (
                            <Row>
                              <Col>Before</Col>
                              <Col>
                                <input
                                  placeholder="2021-12-01 14:30:00"
                                  value={timeBefore}
                                  onChange={e => setTimeBefore(e.target.value)}
                                />
                              </Col>
                            </Row>
                          )}
                        </>
                      )}
                      {newParameterType === "sessionType" && (
                        <Row>
                          <Col>Session Type</Col>
                          <Col>
                            <select
                              value={sessionTypeParameterValue}
                              onChange={e =>
                                setSessionTypeParameterValue(e.target.value)
                              }
                            >
                              <option>Choose...</option>
                              {sessionTypes
                                .sort((a, b) => (a > b ? 1 : -1))
                                .map(st => (
                                  <option>{st}</option>
                                ))}
                            </select>
                          </Col>
                        </Row>
                      )}
                    </Container>
                    <Button onClick={addParameter}>Add Parameter</Button>
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
