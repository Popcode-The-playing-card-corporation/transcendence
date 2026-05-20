import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { GoogleLogin} from "../OAuth/GoogleLogin"
import { FortyTwoLogin } from "../OAuth/42Login";
import { GitLogin } from "../OAuth/GitLogin";

export function Login() {
  const [created, setCreated] = useState(false);
  return (
    <div className="page-content mt-17">
      <h1>Login / Register</h1>
      <div className="log-container">
        {created ? (
          <RegisterForm setCreated={setCreated} />
        ) : (
          <LoginForm setCreated={setCreated} />
        )}
		<div> <GoogleLogin /> </div>
		<div> <FortyTwoLogin /> </div>
		<div> <GitLogin /> </div>
		
      </div>
    </div>
  );
}
