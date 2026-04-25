import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "mega";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: Props) {
  const base =
    "inline-block text-center text-white font-bold uppercase transition duration-300 hover:brightness-110 active:scale-[0.98]";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[#24a900] font-poppins text-[23px] py-5 px-10 rounded-[5px] shadow-cta-glow",
    mega:
      "bg-mega-cta font-montserrat text-[20px] py-5 pl-[50px] pr-[55px] rounded-[35px] shadow-mega-cta",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
