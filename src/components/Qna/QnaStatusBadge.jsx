export function QnaStatusBadge({ hasReply }) {
  return (
    <span className={`w-fit md:min-w-[80px] text-center text-[10px] font-bold tracking-widest px-2 py-1 md:cursor-none ${hasReply ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
      {hasReply ? '답변완료' : '답변대기'}
    </span>
  );
}
