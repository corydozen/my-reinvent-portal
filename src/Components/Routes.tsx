import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Account from "./Account";

const ProppedRoute = ({ render: C, props: childProps, ...rest }: any) => (
  <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

const Routes = ({ childProps }: any) => (
  <Switch>
    <ProppedRoute exact path="/" render={Dashboard} props={childProps} />
    <ProppedRoute exact path="/account" render={Account} props={childProps} />
  </Switch>
);

export default Routes;
