import type { errorT } from "../../utils/type/errorType";
import type { friendT, requestT } from "../../utils/type/friendType";

type Props = {
  friends: friendT[] | errorT,
  requests: requestT[] | errorT
}

export default function HomeFriends({ friends, requests }: Props) {
  return (
    <>
      <h2 className="text-center">Friends</h2>
      <div className="pt-4">
        <h3>Online</h3>
        <div>
          {!("code" in friends) ?
            (
              friends.length === 0 ?
                <p className="text-center">You don't have any friends online, go make some !</p>
                :
                (
                  <ul className="list-disc ms-8">
                    {friends.map((friend: friendT) => {
                      return (
                        <li>{friend.user.username}</li>
                      );
                    })}
                  </ul>
                )
            )
            : "Error about friends in HomeFriends"
          }
        </div>
      </div>
      <div className="pt-4">
        {!("code" in requests) ?
          <p><strong>Requests</strong> : {requests.length}</p>
          : "Error about requests in HomeFriends"
        }
      </div>
    </>
  );
}