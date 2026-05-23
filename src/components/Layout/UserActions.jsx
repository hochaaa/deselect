export function UserActions({ currentUser, onOpenAuth, onOpenLogout }) {
  return (
    <div className="hidden md:block">
      {currentUser ? (
        <div className="absolute top-10 right-10 z-40 flex flex-col items-end gap-1 md:cursor-none">
          <span className="font-bold text-xs tracking-tight text-black md:cursor-none">
            {currentUser.user_metadata?.name || 'Guest'} 님
          </span>
          <button
            onClick={onOpenLogout}
            className="font-bold text-xs tracking-tight text-gray-400 hover:text-black transition border-b border-gray-400 hover:border-black pb-0.5 outline-none uppercase md:cursor-none"
          >
            LOGOUT
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenAuth}
          className="absolute top-10 right-10 font-bold text-xs z-50 tracking-tight text-black hover:text-gray-400 transition border-b border-black hover:border-gray-400 pb-0.5 outline-none uppercase md:cursor-none"
        >
          LOGIN / JOIN
        </button>
      )}
    </div>
  );
}
