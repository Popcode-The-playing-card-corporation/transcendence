import { useContext } from "react";
import { authContext } from "../contexts/CreateAuthContext";

export function useAuth() {
  return useContext(authContext);
}
