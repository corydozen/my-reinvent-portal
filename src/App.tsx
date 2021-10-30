import {
  AmplifyTheme,
  Authenticator,
  ConfirmSignUp,
  ForgotPassword,
  SignIn,
  SignUp,
  UsernameAttributes,
} from "aws-amplify-react";
import React, { useState } from "react";
import "./App.css";
import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";

const App = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);

  const handleAuthStateChange = (state: string) => {
    console.log({ state });
    if (state === "signedIn") {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  };

  return signedIn ? (
    <div className="App">
      <TopNav />
      <Routes />
    </div>
  ) : (
    <Authenticator
      theme={AmplifyTheme}
      hideDefault={true}
      usernameAttributes={UsernameAttributes.EMAIL}
      onStateChange={handleAuthStateChange}
    >
      <ConfirmSignUp />
      <ForgotPassword></ForgotPassword>
      <SignUp
        signUpConfig={{
          hideAllDefaults: true,
          signUpFields: [
            {
              key: "email",
              displayOrder: 1,
              label: "Email",
              placeholder: "Enter your email address",
              required: true,
              type: "username",
            },
            {
              key: "password",
              displayOrder: 2,
              label: "Password",
              placeholder: "password",
              required: true,
              type: "password",
            },
          ],
        }}
      ></SignUp>
      <SignIn></SignIn>
    </Authenticator>
  );
};

export default App;
