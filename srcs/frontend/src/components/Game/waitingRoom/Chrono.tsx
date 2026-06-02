export default function Chrono() {
  return (
    <div className="flex flex-col gap-2 text-center items-center ">
      <div className="content-center text-center">Time left</div>
      <div className="flex flex-row w-1/2 justify-center gap-2">
        <div className="flex flex-col p-2 bg-(--nav-color) rounded-box ">
          <span className="countdown text-3xl font-mono">
            <span style={{"--value":18} as React.CSSProperties} aria-live="polite">18</span>
          </span>
        </div>
        <div className="flex flex-col p-2 bg-(--nav-color) rounded-box ">
          <span className="countdown text-3xl font-mono">
            <span style={{"--value":59, "--digits":2} as React.CSSProperties}  >59</span>
          </span>
        </div>
      </div>
    </div>
  );
}
