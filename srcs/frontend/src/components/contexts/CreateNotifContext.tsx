import { createContext } from "react";
import type { NotifContextType } from "./NotifContext";

export const notifContext = createContext<NotifContextType | undefined>(
  undefined,
);
