import AddingBot from "./addingBot";
import PrivatePublicSlider from "./privPubSlider";
import RoomSize from "./RoomSize";

export default function ParameterRoom() {
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
          <AddingBot />
        </div>
        <div className="flex items-center justify-center col-span-3 border-t border-(--hover-color) pt-6">
          <button className="btn">Confirm</button>
        </div>
      </div>
    </div>
  );
}

