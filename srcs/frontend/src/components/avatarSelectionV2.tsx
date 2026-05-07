import { useState } from "react";
import { FaLongArrowAltRight, FaPen } from "react-icons/fa";

export function AvatarSelectionV2({
  currentAvatar,
}: {
  currentAvatar: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);

  function handleAvatarChange(newPath: string) {
    setTempAvatar(newPath);
    document.getElementById("my_modal_2")?.closeModal();
  }
  return (
    <div
      className="rounded-4xl w-24 bg-(--hover-color) flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => document.getElementById("my_modal_2")?.showModal()}
    >
      <img
        src={tempAvatar}
        className={hovered ? "avatar-hovered" : "" + "rounded-4xl"}
      />
      <FaPen className={hovered ? "pen-hovered" : "hidden"} />
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box rounded-4xl bg-(--hover-color)">
          <FaLongArrowAltRight className="m-auto text-5xl"/>
          <ul className="flex w-fit">
            <li
              className="li-avatars"
              onClick={() =>
                handleAvatarChange("src/assets/avatars/avatar1.png")
              }
            >
              <img
                src="src/assets/avatars/avatar1.png"
                className="rounded-4xl"
              />
            </li>
            <li
              className="li-avatars"
              onClick={() =>
                handleAvatarChange("src/assets/avatars/avatar2.jpg")
              }
            >
              <img
                src="src/assets/avatars/avatar2.jpg"
                className="rounded-4xl"
              />
            </li>
            <li
              className="li-avatars"
              onClick={() =>
                handleAvatarChange("src/assets/avatars/avatar3.jpg")
              }
            >
              <img
                src="src/assets/avatars/avatar3.jpg"
                className="rounded-4xl"
              />
            </li>
            <li className="li-avatars">
              <img
                src="src/assets/avatars/avatar4.webp"
                className="rounded-4xl"
              />
            </li>
            <li className="li-avatars">
              <img
                src="src/assets/avatars/avatar5.jpg"
                className="rounded-4xl"
              />
            </li>
            <li className="li-avatars">
              <img
                src="src/assets/avatars/avatar6.jpg"
                className="rounded-4xl"
              />
            </li>
            <li className="li-avatars">
              <img
                src="src/assets/avatars/avatar7.jpg"
                className="rounded-4xl"
              />
            </li>
            <li className="li-avatars">
              <img
                src="src/assets/avatars/avatar8.jpg"
                className="rounded-4xl"
              />
            </li>
            <li className="li-avatars">
              <img
                src="src/assets/avatars/avatar9.jpg"
                className="rounded-4xl"
              />
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
