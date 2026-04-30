import { useLocation } from "react-router";
import { MdLogin, MdOutlineLeaderboard } from "react-icons/md";
import { TbCards } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { GoLaw } from "react-icons/go";

export function Navbar() {
  const current_location = useLocation();

  const isActive = (path: string) => path === current_location.pathname;

  return (
    <div className="navbar bg-(--nav-color)">
      <div className="flex-1">
        <a className="text-xl item-menu p-2" href="/">
          PopCards
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          <li>
            <a
              className={(isActive("/game") ? "active " : "") + "item-menu"}
              href="/game"
            >
              <TbCards /> Game
            </a>
          </li>
          <li>
            <a
              className={
                (isActive("/leaderboard") ? "active " : "") + "item-menu"
              }
              href="/leaderboard"
            >
              <MdOutlineLeaderboard /> Leaderboard
            </a>
          </li>
          <li>
            <a
              className={(isActive("/profile") ? "active " : "") + "item-menu"}
              href="/profile"
            >
              <CgProfile /> Profile
            </a>
          </li>
          <li>
            <a
              className={(isActive("/settings") ? "active " : "") + "item-menu"}
              href="/settings"
            >
              <CiSettings /> Settings
            </a>
          </li>
          <li>
            <a
              className={(isActive("/rules") ? "active " : "") + "item-menu"}
              href="/rules"
            >
              <GoLaw /> Rules
            </a>
          </li>
          <li>
            <a
              className={(isActive("/login") ? "active " : "") + "item-menu"}
              href="/login"
            >
              <MdLogin fontSize={20} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
