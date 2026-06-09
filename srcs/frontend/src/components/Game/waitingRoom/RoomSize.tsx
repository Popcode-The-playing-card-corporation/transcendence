import type { SetStateAction } from "react";

type Props = {
	maxSize: number;
	setSize: React.Dispatch<SetStateAction<number>>
}

export default function RoomSize({maxSize, setSize}: Props) {

  return (
    <div className="w-full max-w-xs">
      <input
        type="range"
        min="2"
        max="7"
        value={maxSize}
        className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
        step="1"
		onChange={(e) => setSize(Number(e.target.value))} />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
      </div>
    </div>
  );
}