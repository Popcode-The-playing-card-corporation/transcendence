import { useEffect } from "react";

export default function PrivatePublicSlider()
{
  useEffect(() => {

  },[])
  return (
     <div className="w-full max-w-xs px-2">
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="0"
        className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
        step="50" />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>Private</span>
        <span>Friend Only</span>
        <span>Public</span>
      </div>
    </div>
  );
}
