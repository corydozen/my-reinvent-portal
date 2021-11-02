import { Auth } from "aws-amplify";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import { ReduxState } from "../interfaces";

const TopNav = (props: any) => {
  const email = useSelector((state: ReduxState) => state.user.email);
  const signOut = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    currentUser.signOut();
    window.location.reload();
  };

  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand className="nav-link">Stub Miner</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink className="nav-link" to="/dashboard" id="dashboard-nav">
            Dashboard
          </NavLink>
          <NavLink className="nav-link" to="/about" id="about-nav">
            About
          </NavLink>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        <NavLink className="nav-link" to="/account" id="account-link">
          {email}
        </NavLink>
        <Navbar.Text className="mr-3">
          <Button onClick={signOut}>Sign Out</Button>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;
