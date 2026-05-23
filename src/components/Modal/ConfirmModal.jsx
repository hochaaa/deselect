import { X } from 'lucide-react';

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'CONTINUE',
  cancelLabel = 'CANCEL',
  onConfirm,
  onClose,
  zIndex = 'z-[1100]',
  showArrow = false,
}) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity md:cursor-none px-4`}
      onClick={onClose}
    >
      <div
        className="bg-white p-8 w-full max-w-xs relative shadow-2xl border border-gray-200 md:cursor-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition md:cursor-none outline-none"
        >
          <X className="w-5 h-5 md:cursor-none" />
        </button>

        <div className="mb-8 text-left md:cursor-none">
          <h3 className="text-2xl font-bold tracking-tighter leading-snug md:cursor-none">
            {title}
          </h3>
          {description && <p className="text-sm text-gray-500 mt-3 md:cursor-none">{description}</p>}
        </div>

        <div className="flex flex-col gap-3 md:cursor-none">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-105 hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-4 px-6 md:cursor-none outline-none"
          >
            <span className="md:cursor-none">{confirmLabel}</span>
            {showArrow && <span className="md:cursor-none">→</span>}
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-gray-500 text-sm font-bold tracking-widest border border-gray-200 hover:bg-gray-50 hover:text-black transition-all duration-300 md:cursor-none outline-none"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
