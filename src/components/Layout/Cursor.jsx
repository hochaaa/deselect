export function Cursor({ mousePos }) {
  return (
    <>
      <div
        className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[9999] pointer-events-none mix-blend-difference md:cursor-none"
        style={{ transform: `translate(${mousePos.x - 4}px, ${mousePos.y - 4}px)` }}
      />
      <div
        className="hidden md:block fixed top-0 left-0 w-8 h-8 bg-white rounded-full z-[9998] pointer-events-none mix-blend-difference transition-transform duration-150 ease-out md:cursor-none"
        style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
      />
    </>
  );
}
