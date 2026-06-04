import { IoMdInformationCircleOutline } from "react-icons/io";

export default function InfoBtn({changeState}: {changeState: (whichButton: string) => void}) {
  return (
    <>
      <button
        className="btn btn-lg btn-circle btn-primary "
        onClick={() => changeState("info")}
      >
        <IoMdInformationCircleOutline />
      </button>
    </>
  );
}