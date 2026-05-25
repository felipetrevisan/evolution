import Image from "next/image";
import { evolutionLogoDarkUrl, evolutionLogoLightUrl } from "@/lib/brand/assets";

export function EvolutionMark({
  showText = true,
  tone = "default",
  size = "md",
}: {
  showText?: boolean;
  tone?: "default" | "inverse";
  size?: "sm" | "md";
}) {
  const inverse = tone === "inverse";
  const imageSize = size === "sm" ? 40 : 48;

  return (
    <div className="flex items-center gap-3">
      <Image
        alt="Evolution Logo"
        className="shrink-0 object-contain drop-shadow-sm dark:hidden"
        height={imageSize}
        src={evolutionLogoLightUrl}
        unoptimized
        width={imageSize}
      />
      <Image
        alt="Evolution Logo"
        className="hidden shrink-0 object-contain drop-shadow-sm dark:block"
        height={imageSize}
        src={evolutionLogoDarkUrl}
        unoptimized
        width={imageSize}
      />
      {showText ? (
        <div>
          <div className={`font-semibold ${inverse ? "text-white" : "text-primary"}`}>
            Evolution
          </div>
          <div className={`text-xs ${inverse ? "text-primary-fixed" : "text-muted-foreground"}`}>
            Evolua com clareza
          </div>
        </div>
      ) : null}
    </div>
  );
}
