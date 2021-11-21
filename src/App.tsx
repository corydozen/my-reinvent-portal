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
import {
  setAwsPassword,
  setEmail,
  setMyAlerts,
  setMyFriends,
  setMySessions,
} from "./actions";
import "./App.css";
import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";
import { refreshMySessions as refreshMySessionsMutation } from "./graphql/mutations";
import { getMe, getMyGsiFriends } from "./graphql/queries";
import { DbGetMeReturn } from "./interfaces";

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
      const getMyGsiFriendsData = (await API.graphql(
        graphqlOperation(getMyGsiFriends)
      )) as any;
      const getMyGsiFriendsReturn = getMyGsiFriendsData.data
        .getMyGsiFriends as DbGetMeReturn[];
      const friends: DbGetMeReturn[] = [];
      const sessions: DbGetMeReturn[] = [];
      const alerts: DbGetMeReturn[] = [];
      let sub = "";
      for (let iterator = 0; iterator < getMeReturn.length; iterator++) {
        const row = getMeReturn[iterator];
        const rowType = row.SK.substring(
          0,
          row.SK.indexOf("#") !== -1 ? row.SK.indexOf("#") : 999
        );
        switch (rowType) {
          case "info":
            sub = row.PK.substring(row.PK.indexOf("#") + 1);
            dispatch(setEmail(row.email));
            dispatch(setAwsPassword(row.awsPassword));
            break;
          case "friend":
            friends.push(row);
            break;
          case "class":
            sessions.push(row);
            break;
          case "alert":
            alerts.push(row);
            break;
          default:
            console.error(`Unknown rowType in getMeReturn ${rowType}`, { row });
        }
      }
      for (
        let iterator = 0;
        iterator < getMyGsiFriendsReturn.length;
        iterator++
      ) {
        friends.push(getMyGsiFriendsReturn[iterator]);
      }
      dispatch(setMySessions(sessions));
      dispatch(setMyAlerts(alerts));
      dispatch(setMyFriends(friends, sub));
    }
  };

  const refreshMySessions = async () => {
    if (signedIn) {
      (await API.graphql(graphqlOperation(refreshMySessionsMutation))) as any;
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
