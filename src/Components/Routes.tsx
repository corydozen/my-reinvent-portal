import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";

const ProppedRoute = ({ render: C, props: childProps, ...rest }: any) => (
  <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

const Routes = ({ childProps }: any) => (
  <Switch>
    <ProppedRoute exact path="/" render={Dashboard} props={childProps} />
  </Switch>
);

export default Routes;
