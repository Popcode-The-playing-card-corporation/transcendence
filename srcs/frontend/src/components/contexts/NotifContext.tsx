import React, { useState } from "react";
import { notifContext } from "./CreateNotifContext";

export interface NotifContextType {
  title: string;
  body: string;
  isEnabled: boolean;
  duration: number;
  showNotif: (title: string, body: string, duration?: number) => void;
  resetNotif: () => void;
}

export default function NotifProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [duration, setDuration] = useState(10000);

  function showNotif(title: string, body: string, duration?: number) {
    setIsEnabled(true);
    setTitle(title);
    setBody(body);
    if (duration) setDuration(duration);
  }

  function resetNotif() {
    setIsEnabled(false);
  }

  return (
    <notifContext.Provider
      value={{ title, body, isEnabled, duration, showNotif, resetNotif }}
    >
      {children}
    </notifContext.Provider>
  );
}
