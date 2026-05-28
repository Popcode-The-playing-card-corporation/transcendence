export default function Chrono() {
  return (
    <div className="flex flex-row gap-2 text-center auto-cols-max ">
      <div className="content-center">Room closing in : </div>
      <div className="flex flex-col p-2 bg-(--nav-color) rounded-box ">
        <span className="countdown text-3xl">
          <span >24</span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-(--nav-color) rounded-box ">
        <span className="countdown text-3xl">
          <span >59</span>
        </span>
        sec
      </div>
    </div>
  );
}