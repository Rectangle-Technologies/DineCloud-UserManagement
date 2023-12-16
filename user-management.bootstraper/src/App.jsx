import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import RegisterForm from "./components/forms/Register";
import LoginForm from "./components/forms/Login";

const App = () => (
  <div className="container">
    <RegisterForm />
    <LoginForm callBackIfLoggedIn={() => {console.log("User Already logged in"); alert("User already logged in")}} />
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
