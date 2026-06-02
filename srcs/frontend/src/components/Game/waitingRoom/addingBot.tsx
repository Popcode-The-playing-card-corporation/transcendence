export default function AddingBot() {
  return (
    <div className="w-full max-w-xs ">
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
        <span>Kilian (easy)</span>
        <span>Alex (medium)</span>
        <span>Dana (chiante)</span>
      </div>
	  <div className="numberBots flex gap-3 items-center justify-end mt-5">
	  <input type="number" className="input w-1/5" placeholder="number of bots" min="1" max="6"/>
	  <button className="btn">Add</button>
	  </div>
    </div>
  );
}
