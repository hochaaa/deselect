import { Heart, User } from 'lucide-react';

export function MyPage({ currentUser, onLiked }) {
  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">My Page</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="md:cursor-none">
          <p className="text-sm text-transparent select-none md:cursor-none">&nbsp;</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl md:cursor-none">
        <div className="border p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] md:cursor-none">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center md:cursor-none"><User className="text-gray-500 w-8 h-8 md:cursor-none" /></div>
          <h3 className="font-bold text-lg mb-1 md:cursor-none">{currentUser ? currentUser.user_metadata?.name : 'Guest'} 님</h3>
          <p className="text-xs text-gray-500 md:cursor-none">{currentUser ? currentUser.email : '로그인이 필요합니다.'}</p>
        </div>

        <button onClick={onLiked} className="border p-6 hover:bg-gray-50 transition md:cursor-none outline-none flex flex-col justify-center items-center text-center h-full min-h-[200px]">
          <Heart className="mb-4 text-black w-8 h-8 fill-black md:cursor-none" />
          <div className="md:cursor-none">
            <h4 className="font-bold text-lg md:cursor-none">Liked</h4>
            <p className="text-sm text-gray-500 mt-2 md:cursor-none">Product / Brands </p>
          </div>
        </button>
      </div>
    </div>
  );
}
