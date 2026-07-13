import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
const avatar1 = "/avatars/avatar1.png";
const avatar2 = "/avatars/avatar2.jpg";
const avatar3 = "/avatars/avatar3.jpg";
const avatar4 = "/avatars/avatar4.webp";
const avatar5 = "/avatars/avatar5.jpg";
const avatar6 = "/avatars/avatar6.jpg";
const avatar7 = "/avatars/avatar7.jpg";
const avatar8 = "/avatars/avatar8.jpg";
const avatar9 = "/avatars/avatar9.jpg";
const avatar10 = "/avatars/avatar10.jpg";
const avatar11 = "/avatars/avatar11.jpg";
const avatar12 = "/avatars/avatar12.jpg";
const avatar13 = "/avatars/avatar13.jpg";
const avatar14 = "/avatars/avatar14.jpg";
const avatar15 = "/avatars/avatar15.jpg";
const avatar16 = "/avatars/avatar16.jpg";
const avatar17 = "/avatars/avatar17.jpg";
const avatar18 = "/avatars/avatar18.webp";
const avatar19 = "/avatars/avatar19.webp";
const avatar20 = "/avatars/avatar20.webp";
const avatar21 = "/avatars/avatar21.webp";
const avatar22 = "/avatars/avatar22.webp";
const avatar23 = "/avatars/avatar23.webp";
const avatar24 = "/avatars/avatar24.webp";
const avatar25 = "/avatars/avatar25.webp";
import { changeAvatar } from "../../api/http/profile";
import type { errorT } from "../../utils/type/errorType";
import { useNotif } from "../hooks/useNotif";

export function AvatarSelection({
  currentAvatar,
}: {
  currentAvatar: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);
  const [isError, setError] = useState<errorT>({code:200, response: ""});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const notif = useNotif();

  async function handleAvatarChange(newPath: string, e: React.MouseEvent) {
    e.stopPropagation();
	const res = await changeAvatar(newPath);
	if (res.code === 200) {
		setError(res);
		setTempAvatar(newPath);
    	dialogRef.current?.close();
	}
	else {
		setError(res);
		notif?.showNotif("Avatar change error:", res.response, 5000);
		dialogRef.current?.close();
	}
  }

  return (
    <div
      className="rounded-4xl w-24  flex items-center justify-center cursor-pointer max-md:mx-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => dialogRef.current?.showModal()}
    >
      <img
        src={tempAvatar}
        className={(hovered ? "avatar-hovered" : "") + " rounded-4xl avatar-hovered-md"}
      />
      <FaPen className={(hovered ? "pen-hovered " : "md:hidden ") + " pen-hovered-md"} />
      <dialog id="my_modal_2" className="modal" ref={dialogRef}>
        <div className="modal-box rounded-xl w-full">
		  {isError.code !== 200 ? "Unexpected error: " + isError.code + " - Please try again or reload" : ""}
          <ul className="flex w-fit">
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar1, e)}
            >
              <img src={avatar1} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar2, e)}
            >
              <img src={avatar2} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar3, e)}
            >
              <img src={avatar3} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar4, e)}
            >
              <img src={avatar4} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar5, e)}
            >
              <img src={avatar5} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar6, e)}
            >
              <img src={avatar6} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar7, e)}
            >
              <img src={avatar7} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar8, e)}
            >
              <img src={avatar8} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar9, e)}
            >
              <img src={avatar9} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar10, e)}
            >
              <img src={avatar10} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar11, e)}
            >
              <img src={avatar11} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar12, e)}
            >
              <img src={avatar12} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar13, e)}
            >
              <img src={avatar13} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar14, e)}
            >
              <img src={avatar14} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar15, e)}
            >
              <img src={avatar15} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar16, e)}
            >
              <img src={avatar16} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar17, e)}
            >
              <img src={avatar17} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar18, e)}
            >
              <img src={avatar18} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar19, e)}
            >
              <img src={avatar19} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar20, e)}
            >
              <img src={avatar20} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar21, e)}
            >
              <img src={avatar21} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar22, e)}
            >
              <img src={avatar22} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar23, e)}
            >
              <img src={avatar23} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar24, e)}
            >
              <img src={avatar24} className="rounded-4xl" />
            </li>
            <li
              className="li-avatars"
              onClick={(e) => handleAvatarChange(avatar25, e)}
            >
              <img src={avatar25} className="rounded-4xl" />
            </li>
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
