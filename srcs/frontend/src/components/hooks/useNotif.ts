import { useContext } from "react";
import { notifContext } from "../contexts/CreateNotifContext";

export function useNotif() {
  return useContext(notifContext);
}
