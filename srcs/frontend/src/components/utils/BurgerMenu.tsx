import {
  MdLogin,
  MdLogout,
  MdOutlineLeaderboard,
  MdOutlineWbSunny,
} from "react-icons/md";
import { useAuth } from "../hooks/useAuth";
import { useRef, type RefObject } from "react";
import { IoIosMoon } from "react-icons/io";
import { NavLink } from "react-router";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { GoLaw } from "react-icons/go";

type Props = {
  isActive: (path: string) => boolean;
  handleLogout: () => void;
  logout_handler: () => void;
  checkboxTheme: RefObject<HTMLInputElement | null>;
  toggleTheme: () => void;
};

export default function BurgerMenu({
  isActive,
  handleLogout,
  logout_handler,
  toggleTheme,
  checkboxTheme,
}: Props) {
  const auth = useAuth();
  const showConfirmRef = useRef<HTMLDialogElement>(null);
  const drawerRef = useRef<HTMLInputElement>(null);

  return (
    <div className="drawer drawer-end md:hidden z-100">
      <input
        id="my-drawer-5"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-5"
          className="drawer-button btn btn-primary mr-4"
        >
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-5"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-50 p-4 items-center gap-4">
          {/* Sidebar content here */}
          <div className="flex items-center justify-between w-full mb-4">
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
          </div>
          <li>
            <NavLink
			onClick={() => drawerRef.current!.checked = false} 
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
			onClick={() => drawerRef.current!.checked = false} 
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
			onClick={() => drawerRef.current!.checked = false} 
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
			onClick={() => drawerRef.current!.checked = false} 
              to="/rules"
              className={({ isActive }) =>
                (isActive ? "active " : "") + "item-menu"
              }
            >
              <GoLaw /> Rules
            </NavLink>
          </li>
          <dialog id="showConfirm" className="modal" ref={showConfirmRef}>
            <div className="modal-box">
              <h3>Are you sure?</h3>
              <p>You are going to be logged out.</p>
              <div className="flex justify-end gap-2 mt-4">
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
      </div>
    </div>
  );
}
