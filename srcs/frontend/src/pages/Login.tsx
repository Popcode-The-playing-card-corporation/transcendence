import { useEffect, useState, type SetStateAction } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useNavigate } from "react-router";

export function Login({loggedIn, setLoggedIn}:{loggedIn:boolean, setLoggedIn:React.Dispatch<SetStateAction<boolean>>}) {
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);
  
  return (
    <div className="page-content mt-17">
      <h1>Login / Register</h1>
      <div className="log-container">
        {created ? (
          <RegisterForm setCreated={setCreated} setLoggedIn={setLoggedIn} />
        ) : (
          <LoginForm setCreated={setCreated} setLoggedIn={setLoggedIn} />
        )}
		
      </div>
    </div>
  );
}
