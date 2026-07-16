import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { IoIosMoon } from "react-icons/io";
import { MdOutlineWbSunny } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";

export default function Appareance({
  setFontChoice,
}: {
  setFontChoice: Dispatch<SetStateAction<string>>;
}) {	
  const auth = useAuth();
  const toggleThemeRef = useRef<HTMLInputElement>(null)


  const toggleTheme = () => {
    auth.setTheme(auth.theme === "popcode_dark" ? "popcode_light" : "popcode_dark");
  };


  useEffect(() => {
    localStorage.setItem('theme', auth.theme);
    const localTheme = localStorage.getItem('theme')
    document.querySelector("html")?.setAttribute("data-theme", localTheme!);
	if (localTheme === "popcode_light") toggleThemeRef.current!.checked = true
		else toggleThemeRef.current!.checked = false

  }, [auth.theme]);

  return (
    <div>
      <div className="font-selection my-3 mx-auto mb-10">
        <h3>Font selection</h3>
        <div className="dropdown dropdown-start">
          <div tabIndex={0} role="button" className="btn m-1">
            Pick a font{" "}
          </div>
          <ul
            tabIndex={-1}
            className=" dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm "
          >
            <li>
              <a
                className="font-Cause"
                onClick={() => setFontChoice("font-Cause")}
              >
                Cause
              </a>
            </li>
            <li>
              <a
                className="font-JetBrains"
                onClick={() => setFontChoice("font-JetBrains")}
              >
                JetBrains Mono
              </a>
            </li>
            <li>
              <a
                className="font-Yarndings"
                onClick={() => setFontChoice("font-Yarndings")}
              >
                Yarndings 12
              </a>
            </li>
            <li>
              <a
                className="font-Dancing"
                onClick={() => setFontChoice("font-Dancing")}
              >
                Dancing Script
              </a>
            </li>
            <li>
              <a
                className="font-uncial "
                onClick={() => setFontChoice("font-uncial")}
              >
                Uncial Antiqua
              </a>
            </li>
            <li>
              <a
                className="font-Henny"
                onClick={() => setFontChoice("font-Henny")}
              >
                Henny Penny
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="">
        <h3>Theme selection</h3>
		<div className="flex gap-2 items-center">
		<p>Choose between light or dark mode:</p>
        <label className="toggle">
          <input type="checkbox" ref={toggleThemeRef}  defaultChecked={auth.theme === "popcode_light" ? true : false} onChange={toggleTheme}/>
		  <IoIosMoon className="mx-auto " aria-label="disabled" />
		  <MdOutlineWbSunny className="mx-auto" aria-label="enabled" />
        </label>
		</div>
      </div>
	  <div className="mt-10">
		<h3>Accessibility</h3>
		<div className="flex gap-2">
		<p>Arachnophobia mode: </p>
		<label className="toggle">
		<input type="checkbox" />
		</label>
		</div>
	  </div>
    </div>
  );
}
