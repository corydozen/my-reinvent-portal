import API, { graphqlOperation } from "@aws-amplify/api";
import {
  AmplifyTheme,
  Authenticator,
  ConfirmSignUp,
  ForgotPassword,
  SignIn,
  SignUp,
  UsernameAttributes,
} from "aws-amplify-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setEmail } from "./actions";
import "./App.css";
import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";
import { getMe } from "./graphql/queries";
import { DbUser } from "./interfaces";

const App = () => {
  const dispatch = useDispatch();
  const [signedIn, setSignedIn] = useState<boolean>(false);

  const handleAuthStateChange = (state: string) => {
    console.log({ state });
    if (state === "signedIn") {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  };

  useEffect(() => {
    if (signedIn) {
      refreshMe();
    }
  }, [signedIn]);

  const refreshMe = async () => {
    if (signedIn) {
      const { data } = (await API.graphql(graphqlOperation(getMe))) as any;
      const user = data.getMe[0] as DbUser;
      dispatch(setEmail(user.email));
      console.log({ data });
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
