export function PseudoChange() {
  return (
    <div className="modal-box bg-(--bg-color)">
      <h3 className="text-lg font-bold text-center">Change username</h3>
      <p className="py-4 text-center">
        Enter your password and choose your new username
      </p>
      <div className="modal-action">
        <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border-1 p-4 mx-auto">
          <legend className="fieldset-legend">Change username</legend>

          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Your password" />

          <label className="label">New username</label>
          <input
            type="text"
            className="input"
            placeholder="Your new username"
          />
          <form method="dialog" className="flex justify-around">
            <button className="btn bg-(--nav-color) mt-4">Change</button>
            <button className="btn bg-(--nav-color) mt-4">Cancel</button>
          </form>
        </fieldset>
      </div>
    </div>
  );
}
