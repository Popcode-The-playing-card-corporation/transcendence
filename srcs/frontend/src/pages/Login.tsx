import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { Google_login} from "../api/GoogleLogin"

export function Login() {
  const [created, setCreated] = useState(false);
  return (
    <div className="page-content">
      <h1>Login / Register</h1>
      <div className="log-container">
        {created ? (
          <RegisterForm setCreated={setCreated} />
        ) : (
          <LoginForm setCreated={setCreated} />
        )}
		<div> <Google_login /> </div>
		
      </div>
    </div>
  );
}
