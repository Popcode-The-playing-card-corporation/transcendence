import { FaCheck, FaCopy } from "react-icons/fa";

export default function CopyBtn({code}: { code : string}) {

function copyCode(code: string) {
	navigator.clipboard.writeText(code)
}
  return (
    <label className="swap swap-rotate ml-2 my-auto cursor-pointer ">
      {/* this hidden checkbox controls the state */}
      <input type="checkbox" onClick={() => copyCode(code)}/>

	  <FaCopy className="swap-off fill-current mx-auto"/>
	 <FaCheck className="swap-on fill-current text-xl"/>
    </label>
  );
}
