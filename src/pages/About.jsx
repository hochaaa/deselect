export function About() {
  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">About Us</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="md:cursor-none">
          <p className="text-sm text-gray-500 font-medium md:cursor-none break-keep">DE:SELECT</p>
        </div>
      </div>

      <div className="max-w-2xl md:cursor-none">
        <p className="text-lg leading-relaxed text-gray-600 mb-6 md:cursor-none">
          넘쳐나는 정보와 빠르게 변화하는 트렌드 속에서, 우리는 아직 온전한 취향을 발견하지 못한 이들을 위해 존재합니다. 가격이나 불필요한 이슈 등 편견에 구애받지 않고 오직 제품만을 통해 우리의 시각을 제안하는 <strong>큐레이션 플랫폼</strong>입니다.
        </p>
        <p className="text-lg leading-relaxed text-gray-600 mb-6 md:cursor-none">
          취향이라는 것은 오직 한가지 스타일에만 매몰되지 않아도 된다고 생각합니다.<br />
          한 사람을 한가지 단어로 정의할 수 없듯이, 우리는 패션에 있어서도 하나의 스타일만을 고집하지 않고 다양한 시도를 해보는 것을 제안합니다.
        </p>
        <p className="text-lg leading-relaxed text-gray-600 md:cursor-none">
          <strong>개인의 짙은 취향이, 타인의 새로운 경험이 되기까지의 여정을 함께합니다.</strong>
        </p>
      </div>
    </div>
  );
}
