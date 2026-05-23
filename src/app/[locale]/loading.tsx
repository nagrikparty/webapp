export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center transition-colors duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-black/10 dark:border-white/10 border-t-red rounded-full animate-spin"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
