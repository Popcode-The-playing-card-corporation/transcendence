export default function FunctionnementInfos() {
  return (
    <div className="flex justify-center bordered-wmp bg-(--nav-color) max-h-3/4 overflow-scroll">
      <ul>
        <li className="pt-2">You have 15 seconds to play before a bot choose for you.</li>
        <li className="pt-2">If a bot choose for you three times in a row, you're going to be kicked out of the room.</li>
        <li className="pt-2">To select an annonce, click on the annonce button then choose which one you want to make in the little window.</li>
        <li className="pt-2 pb-2">Click on the card you want to play then click on it again to confirm your choice.</li>
      </ul>
    </div>
  );
}