export default function PrivatePublicToggle()
{
  return (
    <> 
     <div className="w-full max-w-xs">
      <input type="range" min="0" max="100" value="50" className="range bg-(--bg-color)" step="50" />
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
    </>
  );
}