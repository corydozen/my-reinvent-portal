import {
  AmplifyTheme,
  Authenticator,
  SignIn,
  UsernameAttributes,
} from "aws-amplify-react";
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);

  const handleAuthStateChange = (state: string) => {
    console.log({ state });
    if (state === "loggedIn") {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  };

  return signedIn ? (
    <div>Signed In!</div>
  ) : (
    <Authenticator
      theme={AmplifyTheme}
      hideDefault={true}
      usernameAttributes={UsernameAttributes.EMAIL}
      onStateChange={handleAuthStateChange}
    >
      <SignIn></SignIn>
    </Authenticator>
  );
};

export default App;
