import React from "react";
import { Button, Card, Container, Col, Row } from "react-bootstrap";
import { Alert as IAlert } from "../interfaces";

interface AlertProps {
  alert: IAlert;
  deleteAlert: (id: string) => {};
}

const Alert = (props: AlertProps) => {
  const { alert, deleteAlert } = props;
  return (
    <Card key={alert.id}>
      <div className="card-body">
        <h4 className="card-title">{alert.alertType}</h4>
        <div className="card-text">
          <Container>
            {/* <Row>
              <Col>Alert Type</Col>
              <Col>{alert.alertType}</Col>
            </Row> */}
            <Row>
              <Col>Updates Or New</Col>
              <Col>{alert.updateOrNew}</Col>
            </Row>
            {/* <Row>
              <Col>Join Parameters With:</Col>
              <Col>{alert.joinParametersWith}</Col>
            </Row> */}
            <Row>
              <Col>Parameters:</Col>
              <Col>{JSON.stringify(alert.parameters)}</Col>
            </Row>
          </Container>
        </div>
      </div>
      <div className="card-footer">
        <Button
          className="float-end btn-danger"
          onClick={() => deleteAlert(alert.id)}
        >
          Remove
        </Button>
      </div>
    </Card>
  );
};

export default Alert;
