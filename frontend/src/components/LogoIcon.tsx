import Image from "next/image";
import Link from "next/link";

interface LogoIconProps {
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className }) => (
  <Link href={"/"}>
    <Image
      src="/logo.png"
      alt="Logo"
      width={100}
      height={100}
      className={className}
    />
  </Link>
);

export default LogoIcon;
