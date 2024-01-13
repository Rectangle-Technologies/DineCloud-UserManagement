import React from "react"
import ReactDOM from "react-dom"
import LoginPage from "./components/Login"

const App = () => (
  <div className="auth-lib">
    <LoginPage />
  </div>
)
ReactDOM.render(<App />, document.getElementById("app"))
