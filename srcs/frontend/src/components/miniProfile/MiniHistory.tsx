import type { historyT } from "../../utils/type/historyType";
import type { errorT } from "../../utils/type/errorType";
import { History } from "../Profile/HistoryPart";

type Props = {
  history: historyT[] | errorT;
};

export function MiniHistory({ history }: Props) {

  if ('code' in history) {
    if (history.response === "Forbidden: not friends")
      return <p>Send a friend request to see this person's history!</p>;
    return <p>Error displaying history</p>;
  }

  return (
    <div
      className="collapse collapse-arrow border border-accent"
    >
      <input id="collapse-1-toggle" type="checkbox" className="peer" />
      <label
        htmlFor="collapse-1-toggle"
        className="fixed inset-0 hidden peer-checked:block"
      ></label>
      <div className="collapse-title font-semibold">
        Show history
      </div>
      <div className="collapse-content text-sm z-1">
        <History gameHistory={history} isHome={false} isMiniProfile={true} />
      </div>
    </div>
  );
}
