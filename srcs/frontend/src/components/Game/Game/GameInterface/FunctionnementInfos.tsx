import { GrAnnounce } from "react-icons/gr";

export default function FunctionnementInfos() {
  return (
    <div className="flex justify-center dropdown-scroll ">
      <ul>
        <li className="pt-2">You have 15 seconds to play.</li>
        <li className="pt-2">If you don't, a bot will do it for you.</li>
        <li className="pt-2">If a bot plays three times in a row for you, you're going to be kicked out of the room.</li>
        <li className="pt-2">To select an annonce, click on the annonce button <GrAnnounce />.</li>
        <li className="pt-2 pb-2">Click on the card you want to play then click on it again to confirm your choice.</li>
      </ul>
    </div>
  );
}