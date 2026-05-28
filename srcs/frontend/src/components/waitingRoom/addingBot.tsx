export default function AddingBot() {
  return (
    <div className="w-full max-w-xs">
      <input
        type="range"
        min="0"
        max="96"
        defaultValue="0"
        className="range [--range-thumb:var(--font-color)] [--range-progress:var(--hover-color)] glass"
        step="16" />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </div>
    </div>
  );
}