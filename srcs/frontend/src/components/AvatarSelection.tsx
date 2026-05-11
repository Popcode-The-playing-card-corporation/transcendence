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
import { changeAvatar } from "../api/profile";

export function AvatarSelection({
  currentAvatar,
}: {
  currentAvatar: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function handleAvatarChange(newPath: string, e: React.MouseEvent) {
    e.stopPropagation();
    setTempAvatar(newPath);
    dialogRef.current?.close();
	const ok = await changeAvatar(newPath);
	if (!ok) {
		console.error('fuck');
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
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
