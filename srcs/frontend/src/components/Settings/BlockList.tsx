import { useEffect, useState } from "react";
// import generateFakeBlockList from "../../utils/test_funcs/generateFakeBlocklist";
import { getBlocked } from "../../api/http/friend";
import { useNotif } from "../hooks/useNotif";
import type { friendT } from "../../utils/type/friendType";
import type { errorT } from "../../utils/type/errorType";
import UnblockBtn from "../UnblockBtn";

export default function BlockList() {
  const [blocklist, setBlocked] = useState<friendT[] | errorT>([]);
  const [updatedBlocked, setUpdatedBlocked] = useState(false);
  const notif = useNotif();
  useEffect(() => {
	
	async function retrieveBlocked() {
		const tmpBlocked = await getBlocked();
		setBlocked(tmpBlocked);
	}
	retrieveBlocked();
  }, [updatedBlocked]);

  if ('code' in blocklist) {
	notif?.showNotif("Unexpected error:", "Error displaying blocked list.", 5000);
	return ;
  }

  return (
    <div className="blocklist my-3 table mx-auto w-fit">
      <table>
        <thead>
          <th>Username</th>
          <th>Blocked at</th>
        </thead>
        <tbody>
          {blocklist.map((blocked) => {
            return (
              <tr>
                <td>
                  <a className="link-hover">{blocked.user.username}</a>
                </td>
                <td>{blocked.blocked_at}</td>
					<td>
						<UnblockBtn req_id={blocked.id} updatedBlocked={updatedBlocked} setUpdate={setUpdatedBlocked} profileRef={null}/>
					</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
