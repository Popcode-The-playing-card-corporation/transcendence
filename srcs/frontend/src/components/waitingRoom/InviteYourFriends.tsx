import generateFakePlayerList from "../../utils/test_funcs/generateFakePlayerList";

export default function InviteYourFriends() {
  const fakeFriendsList = generateFakePlayerList();

  return (
    <>
    <button
      className="btn "
    >
      hi
    </button>
    <div className="modal-box bg-(--nav-color)">
      <div className="flex">
        <p>hi</p>
      </div>
      {/* {* if friend *} 
				 need to modify a lot of thing here like the width of the modal ( surement creer un nouveau component history) */}
    </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
    </>
  );
}