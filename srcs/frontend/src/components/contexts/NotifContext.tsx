import React, { useEffect, useRef, useState } from "react";
import { notifContext } from "./CreateNotifContext";
import type { notifT } from "../../utils/type/notifType";
import { useAuth } from "../hooks/useAuth";

export interface NotifContextType {
  title: string;
  body: string;
  isEnabled: boolean;
  duration: number;
  inbox: notifT[];
  clearInbox: () => void;
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
  const [inbox, setInbox] = useState<notifT[]>([]);
  const [queue, setQueue] = useState<notifT[]>([]);

  const currentNotifRef = useRef<notifT | null>(null);
  const auth = useAuth();

  function clearInbox() {
	setInbox([]);
  }

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

	if (auth.in_game && false) {
		setInbox(inbox => {

			let alreadyQueued = null;
			if (inbox[0])	{
				alreadyQueued = inbox.toReversed()[0].title === newNotif.title && inbox.toReversed()[0].message === newNotif.message;
			}

			if (alreadyQueued) {
				return inbox;
			}

			return [...inbox, newNotif];
			});
	}

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
      value={{ title, body, isEnabled, inbox, clearInbox, duration, showNotif, resetNotif }}
    >
      {children}
    </notifContext.Provider>
  );
}
