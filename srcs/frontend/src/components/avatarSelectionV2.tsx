export function avatarSelectionV2() {
	const 
  return (
    <>

    <div
      className="rounded-4xl w-24 bg-(--hover-color) flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setClicked(true);
        setHovered(false);
      }}
    >
      <img
        src={currentAvatar}
        className={hovered ? "avatar-hovered" : "" + "rounded-4xl"}
      />
      <FaPen className={hovered ? "pen-hovered" : "hidden"} />
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        open modal
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
