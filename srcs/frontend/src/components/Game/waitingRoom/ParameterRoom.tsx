import AddingBot from "./AddingBot";
import PrivatePublicSlider from "./PrivateFriendPublicSlider";
import RoomSize from "./RoomSize";

type Props = {
	roomCode: string;
	updateSettings: () => void;
}

export default function ParameterRoom({roomCode, updateSettings}  : Props) {
  return (
    <div className="bordered grid grid-cols-3 gap-4">
      <div className="col-span-3 grid grid-cols-3 pt-6">
        <div className="text-lg">
          <p>State of the room : </p>
        </div>
        <div className="col-span-2 ">
          <PrivatePublicSlider />
        </div>
      </div>
      <div className="col-span-3 grid grid-cols-3 border-t border-(--hover-color) pt-6">
        <div className="text-lg">
          <p>Maximum number of players : </p>
        </div>
        <div className="col-span-2">
          <RoomSize />
        </div>
      </div>
      <div className="col-span-3 grid grid-cols-3 border-t border-(--hover-color) pt-6">
        <div className="">
          <p>Choose the level and the number of bots you want : </p>
        </div>
        <div className="col-span-2 mb-6">
          <AddingBot roomCode={roomCode} updateSettings={updateSettings}/>
        </div>
        <div className="flex items-center justify-center col-span-3 border-t border-(--hover-color) pt-6">
          <button className="btn" onClick={updateSettings}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

