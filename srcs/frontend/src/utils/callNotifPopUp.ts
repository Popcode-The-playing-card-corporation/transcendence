import {
  setBodyNotif,
  setIsEnabled,
  setTitleNotif,
} from "./notifPopUpVariables";

export function callNotifPopUp(
  title: string,
  body: string,
) {
  setIsEnabled(true);
  setTitleNotif(title);
  setBodyNotif(body);
}
