import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.jpg";
import avatar3 from "../assets/avatars/avatar3.jpg";
import avatar4 from "../assets/avatars/avatar4.webp";
import avatar5 from "../assets/avatars/avatar5.jpg";
import avatar6 from "../assets/avatars/avatar6.jpg";
import avatar7 from "../assets/avatars/avatar7.jpg";
import avatar8 from "../assets/avatars/avatar8.jpg";
import avatar9 from "../assets/avatars/avatar9.jpg";
import avatar10 from "../assets/avatars/avatar10.jpg";
import avatar11 from "../assets/avatars/avatar11.jpg";
import avatar12 from "../assets/avatars/avatar12.jpg";
import avatar13 from "../assets/avatars/avatar13.jpg";
import avatar14 from "../assets/avatars/avatar14.jpg";
import avatar15 from "../assets/avatars/avatar15.jpg";
import avatar16 from "../assets/avatars/avatar16.jpg";
import avatar17 from "../assets/avatars/avatar17.jpg";
import avatar18 from "../assets/avatars/avatar18.webp";
import avatar19 from "../assets/avatars/avatar19.webp";
import avatar20 from "../assets/avatars/avatar20.webp";
import avatar21 from "../assets/avatars/avatar21.webp";
import avatar22 from "../assets/avatars/avatar22.webp";
import avatar23 from "../assets/avatars/avatar23.webp";
import avatar24 from "../assets/avatars/avatar24.webp";
import avatar25 from "../assets/avatars/avatar25.webp";
import { changeAvatar } from "../api/profile";
import type { errorT } from "../utils/errorType";

export function AvatarSelection({
  currentAvatar,
}: {
  currentAvatar: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);
  const [isError, setError] = useState<{code: number} | errorT>({code:200});
  const dialogRef = useRef<HTMLDialogElement>(null);

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
		// console.debug(isError.code);
	}
  }

  return (
    <div
      className="rounded-4xl w-24 bg-(--hover-color) flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => dialogRef.current?.showModal()}
    >
      <img
        src={tempAvatar}
        className={hovered ? "avatar-hovered" : "" + "rounded-4xl"}
      />
      <FaPen className={hovered ? "pen-hovered" : "hidden"} />
      <dialog id="my_modal_2" className="modal" ref={dialogRef}>
        <div className="modal-box rounded-xl bg-(--hover-color) w-full">
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
