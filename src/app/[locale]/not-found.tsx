import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
      <h1 className="font-hindi text-9xl font-black mb-4 tracking-tighter text-red">404</h1>
      <p className="font-mono uppercase tracking-widest text-sm mb-12 opacity-80">
        Page Not Found
      </p>
      <Link 
        href="/"
        className="border border-white/20 px-8 py-4 font-mono uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors"
      >
        Return to Core
      </Link>
    </div>
  );
}
