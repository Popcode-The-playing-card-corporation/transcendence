import { useState } from "react";
import { FortyTwoLogin } from "./42Login";
import { GitLogin } from "./GitLogin";
import { GoogleLogin } from "./GoogleLogin";
import { useLocation } from "react-router";

export default function LoginWithService() {
  const [serviceName, setServiceName] = useState("");
  const location = useLocation();

  const redirect = typeof location.state === "string" ? location.state : "/";

  return (
    <>
      <div className="text-center">Or continue with {serviceName}</div>
      <div className="logBtn flex justify-center gap-2">
        <div
          className="text-center"
          onMouseOver={() => setServiceName("google")}
          onMouseLeave={() => setServiceName("")}
        >
          {" "}
          <GoogleLogin location={redirect} />{" "}
        </div>
        <div
          className="text-center"
          onMouseOver={() => setServiceName("42 login")}
          onMouseLeave={() => setServiceName("")}
        >
          {" "}
          <FortyTwoLogin location={redirect} />{" "}
        </div>
        <div
          className="text-center"
          onMouseOver={() => setServiceName("github")}
          onMouseLeave={() => setServiceName("")}
        >
          {" "}
          <GitLogin location={redirect} />{" "}
        </div>
      </div>
    </>
  );
}
