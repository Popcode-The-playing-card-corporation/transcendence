import { TbPointFilled } from "react-icons/tb";
import type { friendT } from "../utils/friendType";
import { friendArray, getFriends } from "../api/friend";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";

export function Friends() {

	const [friends, setFriends] = useState< friendT[] | errorT>({code: 0, response: ''});
	const navigate = useNavigate();

	useEffect(() => {
	async function retrieveFriends() {
		const data = await getFriends();
		if ("code" in data) {
			setFriends(data);
			return ;
		}
		setFriends(friendArray(data));
	}
	retrieveFriends();
	}, [])


	if ('code' in friends) {
		if (friends.code === 401) {
			localStorage.removeItem('access');
			localStorage.removeItem('refresh');
			navigate('/login');
			return ;
		}
		return <p>Error: {friends.response}</p>; // improve message
	}

  return (
    <table>
      <tr>
        <th className="w-10 text-left"></th>
        <th className="w-50 text-left">Name</th>
        <th className="w-30 text-left">Status</th>
        <th className="w-30 text-left">From</th>
      </tr>
      {friends.map((friend: friendT) => (
        <tr>
          <td className={(friend.online ? "text-green-400" : "") + " text-2xl text-center"}>
            <TbPointFilled />
          </td>
          <td>{friend.username}</td>
          <td>{friend.status}</td>
          <td>{friend.date}</td>
        </tr>
      ))}
    </table>
  );
}
