import type { Dispatch, SetStateAction } from "react";

export default function Appareance({
  setFontChoice,
}: {
  setFontChoice: Dispatch<SetStateAction<string>>;
}) {

  return (
    <div>
      <div className="font-selection my-3 mx-auto mb-26">
        <h3>Font selection</h3>
        <div className="dropdown dropdown-start">
          <div tabIndex={0} role="button" className="btn m-1">
            Pick a font{" "}
          </div>
          <ul
            tabIndex={-1}
            className=" dropdown-content menu bg-(--hover-color) rounded-box z-1 w-52 p-2 shadow-sm "
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
          </ul>
        </div>
      </div>
	  {//<div className="skin-selection">
	  //<h3>Skin selection</h3>
	  //<p>Not implementeed, fuck you</p>
	  //</div>
	  }
    </div>
  );
}
