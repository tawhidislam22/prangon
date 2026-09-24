import Image from "next/image";

interface PrangonLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function PrangonLogo({
  size = 32,
  className = "",
  showText = true,
  textClassName = "text-xl font-bold text-primary",
}: PrangonLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.jpg"
        alt="Prangon logo"
        width={size}
        height={size}
        className="rounded-md"
        priority
      />
      {showText && <span className={textClassName}>Prangon</span>}
    </span>
  );
}
