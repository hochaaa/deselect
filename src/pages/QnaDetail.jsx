import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { QnaProductSummary } from '../components/Qna/QnaProductSummary';
import { findProductById } from '../utils/product';
import { supabase } from '../supabase';

export function QnaDetail({
  selectedQna,
  products,
  isAdmin,
  adminReply,
  isEditingReply,
  onBack,
  onDeleteQna,
  onSelectProductBrand,
  onEditReply,
  onDeleteReply,
  onAdminReplyChange,
  onAdminReplySubmit,
  onCancelEditReply,
}) {
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const productId = selectedQna?.product_id;
  const listedProduct = findProductById(products, productId);

  useEffect(() => {
    if (listedProduct || productId === null || productId === undefined) return;

    let active = true;
    supabase.from('products').select('*').eq('id', productId).maybeSingle().then(({ data }) => {
      if (active) setFetchedProduct(data);
    });
    return () => { active = false; };
  }, [listedProduct, productId]);

  if (!selectedQna) return null;

  const qnaProduct = listedProduct || findProductById([fetchedProduct].filter(Boolean), productId);

  return (
    <div className="mt-32 w-full max-w-4xl mx-auto md:cursor-none">
      <div className="flex justify-between items-center mb-8 md:cursor-none">
        <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-black transition-colors md:cursor-none outline-none tracking-widest uppercase">
          ← Back to List
        </button>

        {isAdmin && (
          <button onClick={() => onDeleteQna(selectedQna.id)} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors md:cursor-none outline-none tracking-widest uppercase">
            DELETE POST
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">{selectedQna.title}</h2>
      </div>
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8 min-h-[2.5rem] md:cursor-none">
        <div className="flex gap-6 text-sm font-medium text-gray-500 md:cursor-none">
          <span className="md:cursor-none">{selectedQna.author}</span>
          <span className="md:cursor-none">{new Date(selectedQna.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div
        className={`flex items-center gap-6 p-6 bg-gray-50 border border-gray-100 mb-12 rounded-sm md:cursor-none transition-colors ${qnaProduct ? 'hover:border-gray-300' : ''}`}
        onClick={() => {
          if (qnaProduct) onSelectProductBrand(qnaProduct.brand);
        }}
      >
        {qnaProduct && (
          <div className="w-24 h-32 bg-white md:cursor-none shrink-0">
            {qnaProduct.img && !imageFailed ? (
              <img src={qnaProduct.img} alt={qnaProduct.name} onError={() => setImageFailed(true)} className="w-full h-full object-contain md:cursor-none" />
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-gray-400">이미지 없음</span>
            )}
          </div>
        )}
        <QnaProductSummary product={qnaProduct} productId={selectedQna.product_id} />
      </div>

      <div className="min-h-[150px] text-lg leading-relaxed text-gray-800 whitespace-pre-wrap mb-16 md:cursor-none">
        {selectedQna.content}
      </div>

      <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 mb-12 md:cursor-none">
        <h4 className="text-sm font-bold tracking-widest mb-6 flex items-center gap-2 md:cursor-none">
          <MessageSquare className="w-4 h-4 md:cursor-none" />
          DE:SELECT STYLING TIP
        </h4>

        {selectedQna.reply && !isEditingReply ? (
          <div className="md:cursor-none">
            <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap md:cursor-none">{selectedQna.reply}</p>

            {isAdmin && (
              <div className="flex gap-4 justify-end mt-6 border-t border-gray-100 pt-4 md:cursor-none">
                <button onClick={() => onEditReply(selectedQna.reply)} className="text-xs font-bold text-gray-400 hover:text-black transition-colors md:cursor-none outline-none tracking-widest uppercase">
                  EDIT REPLY
                </button>
                <button onClick={onDeleteReply} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors md:cursor-none outline-none tracking-widest uppercase">
                  DELETE REPLY
                </button>
              </div>
            )}
          </div>
        ) : isAdmin ? (
          <form onSubmit={onAdminReplySubmit} className="flex flex-col gap-4 md:cursor-none">
            <textarea
              placeholder="운영자님, 이 제품에 대한 스타일링 팁을 작성해주세요."
              value={adminReply}
              onChange={(e) => onAdminReplyChange(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 focus:border-black outline-none p-4 text-sm transition-colors bg-white md:cursor-none resize-none rounded-sm select-text"
            />
            <div className="flex justify-end gap-4 md:cursor-none">
              {isEditingReply && (
                <button type="button" onClick={onCancelEditReply} className="px-6 py-3 bg-white text-gray-500 border border-gray-200 text-xs font-bold tracking-widest hover:bg-gray-50 transition-colors md:cursor-none outline-none">
                  취소
                </button>
              )}
              <button type="submit" className="px-6 py-3 bg-black text-white text-xs font-bold tracking-widest hover:scale-105 transition-transform md:cursor-none outline-none">
                {isEditingReply ? '수정 완료' : '답변 등록'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400 text-sm font-medium md:cursor-none">DE:SELECT의 스타일링 팁이 준비 중입니다.</p>
        )}
      </div>
    </div>
  );
}
