import React, { useEffect, useRef, useState } from "react";
import { notifContext } from "./CreateNotifContext";
import type { notifT } from "../../utils/notifType";

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
  const [queue, setQueue] = useState<notifT[]>([]);

  const currentNotifRef = useRef<notifT | null>(null);

  function showNotif(
    newtitle: string,
    newbody: string,
    newduration = 10000
  ) {
    const newNotif = {
      title: newtitle,
      message: newbody,
      duration: newduration,
    };

    setQueue(queue => {

	  let alreadyQueued = null;
	  if (queue[0])	{
      	alreadyQueued = queue.toReversed()[0].title === newNotif.title && queue.toReversed()[0].message === newNotif.message;
	  }
	  const checkCurr =
        currentNotifRef.current &&
        currentNotifRef.current.title === newNotif.title &&
        currentNotifRef.current.message === newNotif.message;

      if (alreadyQueued || checkCurr) {
        return queue;
      }

      return [...queue, newNotif];
    });
  }

  useEffect(() => {
    function handle_queue() {
      if (isEnabled || queue.length === 0) {
        return;
      }

      currentNotifRef.current = queue[0];

      setTitle(queue[0].title);
      setBody(queue[0].message);
      setDuration(queue[0].duration ?? 10000);
      setIsEnabled(true);

      setQueue(queue => queue.slice(1));
    }

    handle_queue();
  }, [queue, isEnabled]);

  function resetNotif() {
    currentNotifRef.current = null;
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
