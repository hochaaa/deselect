import { Eye, EyeOff, X } from 'lucide-react';

export function AuthModal({
  authMode,
  authForm,
  authError,
  showPassword,
  onClose,
  onSubmit,
  onAuthFormChange,
  onToggleMode,
  onTogglePassword,
}) {
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity md:cursor-none px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 md:p-10 w-full max-w-sm relative shadow-2xl border border-gray-200 md:cursor-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition md:cursor-none outline-none"
        >
          <X className="w-5 h-5 md:cursor-none" />
        </button>

        <div className="mb-8 md:mb-10 text-left md:cursor-none">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tighter leading-snug md:cursor-none">
            LOGIN / JOIN
          </h3>
        </div>

        {authError && (
          <p className="text-red-500 text-xs font-bold mb-6 bg-red-50 p-3 rounded-sm md:cursor-none">{authError}</p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-6 md:cursor-none">
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => onAuthFormChange({ ...authForm, email: e.target.value })}
            className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 md:cursor-none select-text"
          />

          {authMode === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={authForm.name}
              onChange={(e) => onAuthFormChange({ ...authForm, name: e.target.value })}
              className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 md:cursor-none select-text"
            />
          )}

          <div className="relative w-full md:cursor-none">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => onAuthFormChange({ ...authForm, password: e.target.value })}
              className="w-full border-b border-gray-300 focus:border-black none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 md:cursor-none pr-8 select-text"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-0 bottom-2 text-gray-400 hover:text-black transition-colors md:cursor-none outline-none"
            >
              {showPassword ? <Eye className="w-4 h-4 md:cursor-none" /> : <EyeOff className="w-4 h-4 md:cursor-none" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-black text-white text-sm font-bold tracking-widest md:hover:scale-[1.02] hover:shadow-lg transition-all duration-300 md:cursor-none outline-none"
          >
            {authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-bold tracking-widest text-gray-400 md:cursor-none">
          <button
            onClick={onToggleMode}
            className="hover:text-black transition md:cursor-none outline-none uppercase"
          >
            {authMode === 'login' ? 'Create an account' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </div>
  );
}
