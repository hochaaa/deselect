export function QnaWrite({
  products,
  qnaForm,
  qnaProductSearch,
  onSubmit,
  onCancel,
  onFormChange,
  onProductSearchChange,
}) {
  return (
    <div className="mt-32 w-full max-w-4xl mx-auto md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">ASK STYLING</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="md:cursor-none">
          <p className="text-sm text-transparent select-none md:cursor-none">&nbsp;</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-10 md:cursor-none">
        <div className="flex flex-col gap-4 md:cursor-none">
          <label className="font-bold text-sm tracking-widest md:cursor-none">1. 스타일링이 궁금한 제품을 선택해주세요.</label>

          <input
            type="text"
            placeholder="브랜드명 또는 제품명으로 검색"
            value={qnaProductSearch}
            onChange={(e) => onProductSearchChange(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 p-3 text-sm focus:border-black outline-none transition-colors md:cursor-none mb-2 rounded-sm select-text"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-64 overflow-y-auto p-4 border border-gray-200 bg-gray-50 rounded-sm md:cursor-none">
            {products
              .filter((p) => p.name.toLowerCase().includes(qnaProductSearch.toLowerCase()) || p.brand.toLowerCase().includes(qnaProductSearch.toLowerCase()))
              .map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => onFormChange({ ...qnaForm, productId: product.id })}
                  className={`flex flex-col p-2 bg-white border transition-all md:cursor-none outline-none ${qnaForm.productId === product.id ? 'border-black shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="aspect-[4/5] w-full bg-gray-100 mb-2 md:cursor-none">
                    <img src={product.img} alt={product.name} className="w-full h-full object-contain md:cursor-none" />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase line-clamp-1 text-left w-full md:cursor-none">{product.brand}</span>
                  <span className="text-xs font-bold line-clamp-1 text-left w-full mt-1 md:cursor-none">{product.name}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:cursor-none">
          <label className="font-bold text-sm tracking-widest md:cursor-none">2. 제목</label>
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={qnaForm.title}
            onChange={(e) => onFormChange({ ...qnaForm, title: e.target.value })}
            className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 md:cursor-none select-text"
          />
        </div>

        <div className="flex flex-col gap-4 md:cursor-none">
          <label className="font-bold text-sm tracking-widest md:cursor-none">3. 문의 내용</label>
          <textarea
            placeholder="키, 체형, 평소 즐겨입는 스타일 등을 적어주시면 더욱 디테일한 스타일링 팁을 제안해 드립니다."
            value={qnaForm.content}
            onChange={(e) => onFormChange({ ...qnaForm, content: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 focus:border-black outline-none p-4 text-sm transition-colors bg-transparent placeholder-gray-400 md:cursor-none resize-none rounded-sm select-text"
          />
        </div>

        <div className="flex gap-4 justify-end mt-4 md:cursor-none">
          <button type="button" onClick={onCancel} className="px-8 py-4 bg-white text-gray-500 border border-gray-200 text-sm font-bold tracking-widest hover:bg-gray-50 transition-colors md:cursor-none outline-none">
            CANCEL
          </button>
          <button type="submit" className="px-8 py-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-105 transition-transform md:cursor-none outline-none">
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
}
