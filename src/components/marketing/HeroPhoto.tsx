import Image from "next/image";

const CLIP = "M0.16,0 L1,0 L1,1 L0.075,1 C0,0.78 0,0.25 0.16,0 Z";
const INNER = "M0.075,1 C0,0.78 0,0.25 0.16,0";
const OUTER = "M0.04,1 C-0.035,0.78 -0.035,0.25 0.125,0";

export default function HeroPhoto() {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="hero-arc" clipPathUnits="objectBoundingBox">
            <path d={CLIP} />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute inset-0 opacity-30 md:left-auto md:right-0 md:w-[51%] md:opacity-100 md:[clip-path:url(#hero-arc)]">
        <Image
          src="/images/vidatech-hero-scholars.png"
          alt="Smiling school students, one giving a thumbs-up"
          fill
          priority
          sizes="(min-width: 768px) 51vw, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[51%] md:block" aria-hidden>
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <path d={OUTER} fill="none" stroke="#087EBC" strokeWidth="2" opacity="0.6" vectorEffect="non-scaling-stroke" />
          <path
            d={INNER}
            fill="none"
            stroke="#19C5D8"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 8px rgba(25,197,216,0.9))" }}
          />
        </svg>
      </div>
    </>
  );
}
