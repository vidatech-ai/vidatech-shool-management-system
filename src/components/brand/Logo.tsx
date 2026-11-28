import Image from "next/image";

export default function Logo({ width = 215 }: { width?: number }) {
  return (
    <Image
      src="/images/vidatech-logo.png"
      alt="VidaTech"
      width={width}
      height={Math.round((width * 61) / 226)}
      priority
    />
  );
}
