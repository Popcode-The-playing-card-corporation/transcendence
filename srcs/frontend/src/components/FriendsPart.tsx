import { TbPointFilled } from "react-icons/tb";
import type { friendT } from "../utils/friendType";
import { acceptRequest, deleteRequest, denyRequest, friendArray, getFriends } from "../api/friend";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { errorT } from "../utils/errorType";
import { refreshAuth } from "../api/checkAuth";

export function Friends() {
	

	const [friends, setFriends] = useState< friendT[] | errorT>({code: 0, response: ''});
	const navigate = useNavigate();
	const [updatedFriends, setUpdate] = useState(false);

	useEffect(() => {
	
	async function retrieveFriends() {
		let res = await getFriends();
		if ('code' in res) {
			if (res.code === 401) {
				if (!(await refreshAuth())) {
					navigate('/login');
				}
				res = await getFriends();
			}
			if ('code' in res) {
				setFriends(res);
			}
			else {
				const arr = friendArray(res);
				setFriends(arr);
			}
		} else {
			const arr = friendArray(res);
			setFriends(arr);
		}	
	}
	retrieveFriends();
	}, [navigate, updatedFriends])


	if ('code' in friends) {
		return <p>Error: {String(friends.response)}</p>; // improve message
	}

	//todo: add to button when it exists: onClick={() => changeHandler(friend.req_id, 'accept')}
	async function changeHandler(req_id:number, func:string) {
		if (func === 'accept') {
			const res = await acceptRequest(req_id);
			if ('code' in res) {
				console.error(res.response);
			}
		}
		else if (func === 'deny') {
			const res = await denyRequest(req_id);
			if ('code' in res) {
				console.error(res.response);
			}
		}
		else if (func === 'delete') {
			const res = await deleteRequest(req_id);
			if ('code' in res) {
				console.error(res.response);
			}
		}
		setUpdate(!updatedFriends);
		return ;
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
          <td className={(friend.user.is_online ? "text-green-400" : "") + " text-2xl text-center"}>
            <TbPointFilled />
          </td>
          <td>{friend.user.username}</td>
          <td>{friend.status}</td>
          <td>{friend.status === 'pending' ? friend.created_at : friend.accepted_at}</td>
        </tr>
      ))}
    </table>
  );
}
