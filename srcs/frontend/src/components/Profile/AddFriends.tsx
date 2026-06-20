import { useState, type RefObject } from "react";
import { FaPlus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import type { recommendationT } from "../../utils/type/recommendationType";
import type { requestT } from "../../utils/type/friendType";
import { changeHandler } from "../../api/http/friend";
import { useNotif } from "../hooks/useNotif";

type Props = {
  users:requestT[];
  recs:recommendationT[];
  updatedFriends:boolean;
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>;
  ref:RefObject<HTMLDialogElement | null>;
};

export function AddFriends({recs, users, updatedFriends, setUpdate, ref}:Props) {
  console.log(recs); // just here as a placeholder until recommendations are implemented

  const notif = useNotif();
  const [search, setSearch] = useState("");
  return (
    <>
       <div className="modal-box bg-(--nav-color) w-fit">
          <h3 className="font-bold text-lg text-center">Add new friends</h3>
          <p className="py-4 text-center">Press ESC key to close</p>
            <label className="input my-5">
              <IoSearch className="text-2xl" />
              <input
                type="search"
                required
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          <div className="result">
          {
            <table className=" mx-auto">
              <tr>
                <th className="w-28"></th>
                <th></th>
              </tr>
              {
                users.map((res) => {
                  return (

                  <tr className="h-14">
                    <td>{res.username}</td>
                    <td><button className="btn btn-circle" onClick={() => changeHandler(res.id, "request", updatedFriends, setUpdate, ref, notif)}> <FaPlus/> </button></td>
                  </tr>
                  )
                })
              }
            </table>
          }
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button ></button>
      </form>
    </>
  );
}
