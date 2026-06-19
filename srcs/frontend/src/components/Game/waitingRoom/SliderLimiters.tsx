import type { Dispatch, SetStateAction } from "react";

type Props = {
  lim: boolean;
  setValue: Dispatch<SetStateAction<number>>;
  value: number;
};

export default function SliderLimiters({ lim, setValue, value }: Props) {
  if (lim) {
    return (
      <>
        <input
          type="range"
          min="0"
          max="2"
          value={value}
          className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
          step="1"
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>Short (333)</span>
          <span>Medium (666)</span>
          <span>Long (1000)</span>
        </div>
      </>
    );
  } else  {
    return (
      <>
        <input
          type="range"
          min="0"
          max="2"
          value={value}
          className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
          step="1"
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div className="flex justify-between px-2.5 mt-2 text-xs">
          <span>Short (3)</span>
          <span>Medium (6)</span>
          <span>Long (10)</span>
        </div>
      </>
    );
  } 
}
