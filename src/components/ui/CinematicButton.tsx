import { Link } from "@/i18n/routing";

interface CinematicButtonProps {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function CinematicButton({ 
  href, 
  text, 
  variant = "primary",
  className = "" 
}: CinematicButtonProps) {
  const baseStyle = "inline-flex items-center justify-center px-8 py-4 font-english font-medium tracking-widest uppercase text-sm transition-all duration-300 transform hover:-translate-y-1";
  
  const variants = {
    primary: "bg-red text-white hover:bg-red/90 shadow-md hover:shadow-lg border border-red/50",
    secondary: "bg-transparent text-black border border-black/35 hover:border-black hover:bg-black/5"
  };

  return (
    <Link 
      href={href}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {text}
    </Link>
  );
}
