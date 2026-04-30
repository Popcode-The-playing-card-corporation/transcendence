import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export function Login() {
  const [created, setCreated] = useState(true);
  return (
    <div className="page-content">
      <h1>Login / Register</h1>
      <div className="log-container">
        {created ? (
          <RegisterForm setCreated={setCreated} />
        ) : (
          <LoginForm setCreated={setCreated} />
        )}
      </div>
    </div>
  );
}
