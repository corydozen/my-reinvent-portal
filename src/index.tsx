import Amplify from "aws-amplify";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { config } from "./config";

const amplifyConfig = {
  Auth: {
    region: "us-east-1",
    userPoolId: config.UserPoolId,
    userPoolWebClientId: config.UserPoolClientId,
  },
  API: {
    aws_appsync_graphqlEndpoint: config.apiurl,
    aws_appsync_region: "us-east-1",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  },
  aws_appsync_graphqlEndpoint: config.apiurl,
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
};

Amplify.configure(amplifyConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
