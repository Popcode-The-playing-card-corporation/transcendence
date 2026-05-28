import AddingBot from "./addingBot";
import PrivatePublicSlider from "./privPubSlider";
import RoomSize from "./RoomSize";

export default function ParameterRoom() {
  return (
    <div className="bordered grid grid-cols-3 gap-4">
      <div className="text-lg">
        <p>State of the room : </p>
      </div>
      <div className="col-span-2">
        <PrivatePublicSlider/>
      </div>
      <div className="text-lg">
        <p>Maximum number of players : </p>
      </div>
      <div className="col-span-2">
        <RoomSize />
      </div>
      <div>
        <p>Choose the level and the number of bots you want : </p>
      </div>
      <div className="col-span-2">
        <AddingBot />
      </div>
    </div>
  );
}