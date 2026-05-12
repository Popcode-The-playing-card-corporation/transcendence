import status from "../api/login_status"

export function Game() {
	console.debug(status.logged_in)
  return (
    <div className="page-content mt-5">
      <h1>Game</h1>
      <img className="m-auto" src="./src/assets/game-icon.png" />
    </div>
  );
}
