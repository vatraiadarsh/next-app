import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Form, Message, Icon, Segment } from "semantic-ui-react";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import {handleLogin}  from "../utils/auth";

import axios from "axios";

function Signup() {
  const INITIAL_STATE = {
    name: "",
    email: "",
    password: "",
  };

  const [user, setUser] = useState(INITIAL_STATE);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isUser = Object.values(user).every((el) => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const url = `${baseUrl}/api/signup`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data);
      // console.log(user);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Message
        attached
        icon="settings"
        header="Get Started"
        content="Create a new account"
        color="purple"
      />

      <Form loading={loading} onSubmit={handleSubmit} error={Boolean(error)}>
        <Message error header="Oops" content={error} />

        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={user.value}
          />
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={user.email}
          />

          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={user.password}
          />

          <Button
            content="Signup"
            type="submit"
            icon="signup"
            disabled={disabled || loading}
            color="facebook"
          />
        </Segment>
      </Form>

      <Message attached="bottom">
        <Icon name="help" />
        Existing user?{" "}
        <Link href="/login">
          <a>Log in here</a>
        </Link>{" "}
        Instead
      </Message>
    </>
  );
}

export default Signup;
