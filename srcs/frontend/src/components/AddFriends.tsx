import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export function AddFriends() {
	const [search, setSearch] = useState("");
	const result = [{
		id:0,
		username: "danouille",
	},
	{
		id:2,
		username: "dananas",
	},
	{
		id:3,
		username: "danube",
	},
	{
		id:4,
		username: "danazi",
	},
	{
		id:5,
		username: "danabelle",
	}
	]
  return (
    <div>
      <div className="modal-box bg-(--nav-color)">
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
					result.map((res) => {
						return (

						<tr className="h-14">
							<td>{res.username}</td>
							<td><button className="btn btn-circle"> <FaPlus/> </button></td>
						</tr>
						)
					})
				}
			</table>
		}
		</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </div>
  );
}
