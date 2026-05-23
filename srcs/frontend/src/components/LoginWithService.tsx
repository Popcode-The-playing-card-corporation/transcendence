import { useState } from "react";
import { FortyTwoLogin } from "./42Login";
import { GitLogin } from "./GitLogin";
import { GoogleLogin } from "./GoogleLogin";

export default function LoginWithService() {
  const [servicName, setServiceName] = useState("");
  return (
    <>
      <div className="text-center">Or continue with {servicName}</div>
      <div className="logBtn flex justify-center gap-2">
        <div
          className="text-center"
          onMouseOver={() => setServiceName("google")}
          onMouseLeave={() => setServiceName("")}
        >
          {" "}
          <GoogleLogin />{" "}
        </div>
        <div
          className="text-center"
          onMouseOver={() => setServiceName("42 login")}
          onMouseLeave={() => setServiceName("")}
        >
          {" "}
          <FortyTwoLogin />{" "}
        </div>
        <div
          className="text-center"
          onMouseOver={() => setServiceName("github")}
          onMouseLeave={() => setServiceName("")}
        >
          {" "}
          <GitLogin />{" "}
        </div>
      </div>
    </>
  );
}
