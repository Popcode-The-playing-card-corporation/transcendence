import { useState } from "react";
import SliderLimiters from "./SliderLimiters";

export default function Limiters() {
  const [lim, setLim] = useState(false);
  const [value, setValue] = useState(0);

  return (
    <div className="w-full max-w-xs ">
      <div className="flex mb-10 gap-4 justify-center items-center">
        <p>Rounds</p>
        <input
          type="checkbox"
          defaultChecked
          checked={lim}
          className="toggle border-(--hover-color) bg-(--hover-color) text-(--font-color) checked:border-(--nav-color) checked:bg-(--nav-color) checked:text-(--font-color)"
          onClick={() => setLim(!lim)}
        />
        <p>Points</p>
      </div>
      <SliderLimiters lim={lim} value={value} setValue={setValue} />
    </div>
  );
}
