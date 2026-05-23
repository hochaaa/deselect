export function Home({ onExplore }) {
  return (
    <div className="h-full min-h-[75vh] flex flex-col justify-center md:cursor-none">
      <div className="flex flex-col gap-2 mb-12">
        <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-black md:cursor-none">
          WE SELECT,
        </h2>
        <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-gray-300 md:cursor-none">
          YOU EXPERIENCE.
        </h2>
      </div>
      <p className="text-lg md:text-xl font-medium text-gray-500 max-w-2xl mb-16 leading-relaxed tracking-tight break-keep md:cursor-none">
        수많은 브랜드와 넘쳐나는 정보 속, 우리는 오직 제품에만 집중합니다. DE:SELECT의 시선으로 바라본 큐레이션을 경험해보세요.
      </p>
      <div>
        <button
          onClick={onExplore}
          className="group flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] outline-none md:cursor-none text-black hover:text-gray-500 transition-colors"
        >
          <span>Explore the curation</span>
          <span className="transition-transform duration-500 group-hover:translate-x-4">→</span>
        </button>
      </div>
    </div>
  );
}
