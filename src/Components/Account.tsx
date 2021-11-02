import API, { graphqlOperation } from "@aws-amplify/api";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { savePassword } from "../graphql/mutations";
import { ReduxState } from "../interfaces";

const Account = () => {
  const password = useSelector((state: ReduxState) => state.user.awsPassword);

  const [localPassword, setLocalPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setLocalPassword(password);
  }, [password]);

  const handleSavePassword = async () => {
    const savePasswordResponse = (
      (await API.graphql(
        graphqlOperation(savePassword, { password: localPassword })
      )) as any
    ).data;
    console.log({ savePasswordResponse });
  };
  return (
    <Container>
      <h1>Your Account</h1>
      <Row>
        <Col>AWS Reinvent Portal Password</Col>
        <Col>
          {showPassword ? (
            <Button className="btn-sm" onClick={() => setShowPassword(false)}>
              Hide Password
            </Button>
          ) : (
            <Button className="btn-sm" onClick={() => setShowPassword(true)}>
              Show Password
            </Button>
          )}
        </Col>
        <Col>
          <FormControl
            type={showPassword ? "" : "password"}
            value={localPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              console.log({ e });
              setLocalPassword(e.target.value || "");
            }}
            id="password"
          />
        </Col>
        <Col>
          <Button onClick={handleSavePassword}>Save</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
