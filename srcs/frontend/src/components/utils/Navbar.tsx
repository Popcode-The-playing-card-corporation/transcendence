import { NavLink, useLocation } from "react-router";
import {
  MdLogout,
  MdLogin,
  MdOutlineLeaderboard,
  MdOutlineWbSunny,
} from "react-icons/md";
import { TbCards } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { GoLaw } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/http/login";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { IoIosMoon } from "react-icons/io";

function getPreferedTheme() {
	if (window.matchMedia('(prefers-color-sheme: dark)'))
		return ("popcode_dark");
	else
		return ("popcode_light");
}

export function Navbar() {
  const navigate = useNavigate();
  const current_location = useLocation();
  const isActive = (path: string) => path === current_location.pathname;
  const auth = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? getPreferedTheme());

  const toggleTheme = () => {
    setTheme(theme === "popcode_dark" ? "popcode_light" : "popcode_dark");
  };

  async function handleLogout() {
    if (!auth.logged_in) {
      navigate("/login", { state: current_location.pathname });
      return;
    }

    auth.setLogging(true);
    const res = await logout();

    if (res.code !== 200 && res.code !== 401) {
      auth.setLogging(false);
      return;
    }
    auth.setLoggedIn(false);
    localStorage.removeItem("code");
    auth.setUserID(null);
    navigate("/login", { state: current_location.pathname });
    setTimeout(() => {
      auth.setLogging(false);
    }, 500);
  }

  useEffect(() => {
	  localStorage.setItem('theme', theme);
	  const localTheme = localStorage.getItem('theme')
    document.querySelector("html")?.setAttribute("data-theme", localTheme!);
  }, [theme]);

  return (
    <div className="navbar min-h-16 h-16 bg-primary fixed top-0 z-100">
      <div className="flex-1">
        <a className="text-xl item-menu p-2" href="/">
          PopCards
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal gap-1">
          <li>
            <NavLink
              to="/game"
              className={({ isActive }) =>
                (isActive ? "active " : "") + "item-menu"
              }
            >
              <TbCards /> Game
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                (isActive ? "active " : "") + "item-menu"
              }
            >
              <MdOutlineLeaderboard /> Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                (isActive ? "active " : "") + "item-menu"
              }
            >
              <CgProfile /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                (isActive ? "active " : "") + "item-menu"
              }
            >
              <CiSettings /> Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rules"
              className={({ isActive }) =>
                (isActive ? "active " : "") + "item-menu"
              }
            >
              <GoLaw /> Rules
            </NavLink>
          </li>
          <li>
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input type="checkbox" onClick={toggleTheme} />

              <MdOutlineWbSunny className="swap-on text-xl" />
              <IoIosMoon className="swap-off text-xl" />
            </label>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className={(isActive("/login") ? "active " : "") + "item-menu"}
            >
              {auth.logged_in ? (
                <MdLogout fontSize={20} />
              ) : (
                <MdLogin fontSize={20} />
              )}
            </button>
          </li>
          {/* {auth.logged_in ? ( */}
          {/*   <li> */}
          {/*     <Notif_Inbox></Notif_Inbox> */}
          {/*   </li> */}
          {/* ) : null} */}
        </ul>
      </div>
    </div>
  );
}
