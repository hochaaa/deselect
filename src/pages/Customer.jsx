import { MessageSquare } from 'lucide-react';
import { QnaStatusBadge } from '../components/Qna/QnaStatusBadge';

export function Customer({ qnaList, products, currentUser, onRequireWrite, onSelectQna }) {
  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">STYLING Q&A</h2>
        <div></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="md:cursor-none">
          <p className="text-sm text-gray-500 font-medium md:cursor-none break-keep">DE:SELECT 큐레이션 제품에 대한 스타일링 팁을 제안해 드립니다.</p>
        </div>
        <button onClick={() => onRequireWrite(currentUser)} className="px-6 py-1 bg-black text-white text-xs font-bold tracking-widest hover:scale-105 transition-transform md:cursor-none outline-none w-fit">
          WRITE
        </button>
      </div>

      <div className="flex flex-col md:cursor-none">
        {qnaList.map((qna) => {
          const product = products.find((p) => p.id === qna.product_id);
          return (
            <button
              key={qna.id}
              onClick={() => onSelectQna(qna)}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition md:cursor-none outline-none text-left gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-1 md:cursor-none">
                <QnaStatusBadge hasReply={Boolean(qna.reply)} />
                <div className="flex flex-col md:cursor-none">
                  <span className="text-xs text-gray-400 font-mono uppercase mb-1 md:cursor-none">{product?.brand}</span>
                  <h4 className="font-bold text-lg md:cursor-none">{qna.title}</h4>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400 font-medium min-w-fit md:cursor-none">
                <span className="md:cursor-none">{qna.author}</span>
                <span className="md:cursor-none">{new Date(qna.created_at).toLocaleDateString()}</span>
              </div>
            </button>
          );
        })}

        {qnaList.length === 0 && (
          <div className="text-center py-32 md:cursor-none">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4 md:cursor-none" />
            <p className="text-gray-400 font-medium md:cursor-none">등록된 문의가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
