import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { getBlocked } from "../../api/http/friend";
import { useNotif } from "../hooks/useNotif";
import type { friendT } from "../../utils/type/friendType";
import type { errorT } from "../../utils/type/errorType";
import UnblockBtn from "./UnblockBtn";

export default function BlockList({
  setBlock,
  updatedBlock,
}: {
  setBlock: Dispatch<SetStateAction<boolean>>;
  updatedBlock: boolean;
}) {
  const [blocklist, setBlocked] = useState<friendT[] | errorT>([]);
  const notif = useNotif();
  useEffect(() => {
    async function retrieveBlocked() {
      const tmpBlocked = await getBlocked();
      setBlocked(tmpBlocked);
    }
    retrieveBlocked();
  }, [updatedBlock]);

  if ("code" in blocklist) {
    notif?.showNotif(
      "Unexpected error:",
      "Error displaying blocked list.",
      5000,
    );
    return;
  }

  return (
    <div className="blocklist my-3 table mx-auto w-fit">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Blocked at</th>
          </tr>
        </thead>
        <tbody>
          {blocklist.map((blocked) => {
            return (
              <tr key={blocked.id}>
                <td>
                  <a className="link-hover">{blocked.user.username}</a>
                </td>
                <td>{blocked.blocked_at}</td>
                <td>
                  <UnblockBtn
                    req_id={blocked.id}
                    updatedBlocked={updatedBlock}
                    setUpdate={setBlock}
                    profileRef={null}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
