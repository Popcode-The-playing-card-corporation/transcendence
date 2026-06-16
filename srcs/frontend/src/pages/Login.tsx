import { useEffect, useState, } from "react";
import { LoginForm } from "../components/Login/LoginForm";
import { RegisterForm } from "../components/Login/RegisterForm";
import { useNavigate } from "react-router";
import { useAuth } from "../components/hooks/useAuth";

export function Login() {
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.logged_in) {
      navigate("/");
    }
  }, [auth.logged_in, navigate]);
  
  return (
    <div className="page-content mt-17">
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
