import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthForm = () => {
  const [key, setKey] = useState("login");

  return (
    <div className="bg-blue-400 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-white">Welcome</h2>
      <Tabs
        id="auth-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
      >
        <Tab eventKey="login" title="Login">
          <LoginForm />
        </Tab>
        <Tab eventKey="signup" title="Sign Up">
          <SignupForm />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AuthForm;
