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
import { useEffect, useRef } from "react";
import { IoIosMoon } from "react-icons/io";
import BurgerMenu from "./BurgerMenu";
import logo from "../../../static/logo.png";

export function Navbar() {
  const navigate = useNavigate();
  const current_location = useLocation();
  const isActive = (path: string) => path === current_location.pathname;
  const auth = useAuth();
  const showConfirmRef = useRef<HTMLDialogElement>(null);
  const checkboxTheme = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    auth.setTheme(
      auth.theme === "popcode_dark" ? "popcode_light" : "popcode_dark",
    );
  };

  function logout_handler() {
    auth.setHasFriendRequest(false);
    navigate("/login", { state: current_location.pathname });
  }

  async function handleLogout() {
    auth.setLogging(true);
    const res = await logout();

    if (res.code !== 200 && res.code !== 401) {
      auth.setLogging(false);
      return;
    }
    auth.setLoggedIn(false);
    localStorage.removeItem("code");
    auth.setUserID(null);
    logout_handler();
    setTimeout(() => {
      auth.setLogging(false);
    }, 500);
  }

  useEffect(() => {
    localStorage.setItem("theme", auth.theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html")?.setAttribute("data-theme", localTheme!);
    if (localTheme === "popcode_dark") checkboxTheme.current!.checked = false;
    else checkboxTheme.current!.checked = true;
  }, [auth.theme]);

  return (
    <div className="navbar min-h-16 h-16 bg-primary fixed top-0 z-100">
      <div className="flex-1">
        <li>
          <NavLink
            className="text-xl item-menu p-2 flex items-center gap-2 w-fit"
            to="/"
          >
            <img src={logo} className="h-6" />
            PopCards
          </NavLink>
        </li>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal gap-1 max-md:hidden">
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
                (isActive ? "active " : "") +
                "item-menu" +
                (auth.hasFriendRequest ? " indicator" : "")
              }
            >
              {auth.hasFriendRequest ? (
                <div className="indicator-item badge badge-xs" />
              ) : null}
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
              <input
                type="checkbox"
                onClick={toggleTheme}
                ref={checkboxTheme}
              />

              <MdOutlineWbSunny className="swap-on text-xl" />
              <IoIosMoon className="swap-off text-xl" />
            </label>
          </li>
          <li>
            <button
              onClick={() =>
                auth.logged_in
                  ? showConfirmRef.current?.showModal()
                  : logout_handler()
              }
              className={(isActive("/login") ? "active " : "") + "item-menu"}
            >
              {auth.logged_in ? (
                <MdLogout fontSize={20} />
              ) : (
                <MdLogin fontSize={20} />
              )}
            </button>
          </li>
          <dialog id="showConfirm" className="modal" ref={showConfirmRef}>
            <div className="modal-box">
              <h3>Are you sure?</h3>
              <p>You are going to be logged out.</p>
              <div className="flex justify-end gap-2">
                <button className="btn del" onClick={handleLogout}>
                  Confirm
                </button>
                <button
                  className="btn"
                  onClick={() => showConfirmRef.current?.close()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        </ul>
        <BurgerMenu
          isActive={isActive}
          logout_handler={logout_handler}
          checkboxTheme={checkboxTheme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}
