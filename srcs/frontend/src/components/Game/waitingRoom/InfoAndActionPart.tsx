import Chrono from "./Chrono";
import CopyBtn from "./CopyBtn";
import StartGameBtn from "./StartGameBtn";

export default function InfoAndActionPart() {
  return (
    <div className=" mt-10 -mb-10 col-span-3 flex justify-between items-end">
      <div className="flex gap-3 flex-col justify-center items-center text-center w-fit">
        <p className="flex text-center">Room Code</p>
        <p className="w-full flex rounded-md bg-(--hover-color) text-lg p-2">
          CodeOfGame67 <CopyBtn code={"CodeOfGame67 "} />{" "}
        </p>
      </div>
      <Chrono />
      <div className="flex justify-center">
        <StartGameBtn />
      </div>
    </div>
  );
}
