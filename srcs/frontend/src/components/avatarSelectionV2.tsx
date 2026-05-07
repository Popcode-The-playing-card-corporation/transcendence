import { useRef, useState } from "react";
import { FaLongArrowAltRight, FaPen } from "react-icons/fa";
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.jpg";
import avatar3 from "../assets/avatars/avatar3.jpg";
import avatar4 from "../assets/avatars/avatar4.webp";
import avatar5 from "../assets/avatars/avatar5.jpg";
import avatar6 from "../assets/avatars/avatar6.jpg";
import avatar7 from "../assets/avatars/avatar7.jpg";
import avatar8 from "../assets/avatars/avatar8.jpg";
import avatar9 from "../assets/avatars/avatar9.jpg";

export function AvatarSelectionV2({
  currentAvatar,
}: {
  currentAvatar: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleAvatarChange(newPath: string, e: React.MouseEvent) {
    e.stopPropagation();
    setTempAvatar(newPath);
    dialogRef.current?.close();
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
        <div className="modal-box rounded-4xl bg-(--hover-color)">
          <FaLongArrowAltRight className="m-auto text-5xl" />
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
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
