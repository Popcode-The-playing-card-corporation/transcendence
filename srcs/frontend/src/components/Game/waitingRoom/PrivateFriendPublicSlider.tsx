import type { SettingsT } from "../../../utils/type/boardDataType";
import { useGame } from "../context/GameContext";

export default function PrivateFriendPublicSlider({updateSettings}:{updateSettings:(changes: Partial<SettingsT>) => void})
{
	const { state, setMode } = useGame(); 
	let is_host = false;
	if (state.settings.listPlayer.filter(user => user.is_host)[0]) {
		is_host = state.user === state.settings.listPlayer.filter(user => user.is_host)[0].username;
	}
	
	function handle_change(e:number) {
		setMode(e);
		updateSettings({mode:e});
	}
  return (
     <div className="w-full max-w-xs px-2">
      <input
        type="range"
        min="0"
        max="2"
		value={state.settings.mode}
        className="range [--range-progress:var(--color-base-200)] glass"
        step="1"
		onChange={(e) => handle_change(Number(e.target.value))}
		disabled={!is_host}
		 />
		
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        <span>Private</span>
        <span>Friend Only</span>
        <span>Public</span>
      </div>
    </div>
  );
}
