export function Navbar() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">
          PopCards
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          <li>
            <a href="/game">Game</a>
          </li>
          <li>
            <a href="/leaderboard">Leaderboard</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
