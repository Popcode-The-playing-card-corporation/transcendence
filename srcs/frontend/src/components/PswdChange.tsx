export function PswdChange() {
  return (
    <div className="modal-box bg-(--bg-color)">
      <h3 className="text-lg font-bold text-center">Change password</h3>
      <p className="py-4 text-center">Enter your password and choose your new one</p>
      <div className="modal-action">
        <fieldset className="fieldset bg-(--bg-color) border-(--accent-color) rounded-box w-xs border-1 p-4 mx-auto">
          <legend className="fieldset-legend">Change password</legend>

          <label className="label">Old password</label>
          <input type="password" className="input" placeholder="old password" />

          <label className="label">New password</label>
          <input type="password" className="input" placeholder="new password" />
          <label className="label">Confirm new password</label>
          <input
            type="password"
            className="input"
            placeholder="confirm new password"
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
