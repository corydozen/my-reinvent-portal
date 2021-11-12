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
import { setAwsPassword, setEmail, setMySessions } from "./actions";
import "./App.css";
import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";
import { getMe, getMySessions as getMySessionsQuery } from "./graphql/queries";
import { refreshMySessions as refreshMySessionsMutation } from "./graphql/mutations";
import {
  DbSession,
  DbGetMeReturn,
  Friend,
  Session,
  Alert,
  AlertType,
  AlertParameter,
} from "./interfaces";

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
      refreshMySessions();
      refreshMe();
    }
  }, [signedIn]);

  const refreshMe = async () => {
    if (signedIn) {
      const { data } = (await API.graphql(graphqlOperation(getMe))) as any;
      const getMeReturn = data.getMe as DbGetMeReturn[];
      const friends: Friend[] = [];
      const sessions: Session[] = [];
      const alerts: Alert[] = [];
      for (let iterator = 0; iterator < getMeReturn.length; iterator++) {
        const row = getMeReturn[iterator];
        const rowType = row.SK.substring(0, row.SK.indexOf("#"));
        switch (rowType) {
          case "info":
            dispatch(setEmail(row.email));
            dispatch(setAwsPassword(row.awsPassword));
            break;
          case "friend":
            friends.push({
              email: row.email,
              status: row.SK.substring(
                row.SK.indexOf("#"),
                row.SK.indexOf("#", row.SK.indexOf("#") + 1)
              ),
            });
            break;
          case "class":
            sessions.push({
              sessionId: row.SK.substring(row.SK.indexOf("#", 8) + 1),
              description: row.description,
              duration: row.duration,
              endTime: row.endTime,
              name: row.name,
              room: row.room,
              sessionType: row.sessionType,
              startTime: row.startTime,
            });
            break;
          case "alert":
            alerts.push({
              alertType: row.alertType as AlertType,
              id: row.SK.substring(row.SK.indexOf("#")),
              joinParametersWith: row.joinParametersWith as "and" | "or",
              parameters: JSON.parse(row.parameters) as AlertParameter[],
            });
            break;
          default:
            console.error(`Unknown rowType in getMeReturn ${rowType}`);
        }
      }
    }
  };

  const refreshMySessions = async () => {
    if (signedIn) {
      (await API.graphql(graphqlOperation(refreshMySessionsMutation))) as any;
    }
  };

  const getMySessions = async () => {
    if (signedIn) {
      const { data } = (await API.graphql(
        graphqlOperation(getMySessionsQuery)
      )) as any;
      console.log({ data });
      const sessions = data.getMySessions as DbSession[];
      dispatch(setMySessions(sessions));
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
