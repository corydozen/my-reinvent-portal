import React from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import { Alert as IAlert } from "../interfaces";

interface AlertProps {
  alert: IAlert;
}

const Alert = (props: AlertProps) => {
  const { alert } = props;
  return (
    <Card key={alert.id}>
      <div className="card-body">
        <h4 className="card-title">{alert.alertType}</h4>
        <div className="card-text">
          <Container>
            <Row>
              <Col>Join Parameters With:</Col>
              <Col>{alert.joinParametersWith}</Col>
            </Row>
            <Row>
              <Col>Parameters:</Col>
              <Col>{JSON.stringify(alert.parameters)}</Col>
            </Row>
          </Container>
        </div>
      </div>
    </Card>
  );
};

export default Alert;
