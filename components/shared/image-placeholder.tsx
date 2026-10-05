import { ImageIcon } from "lucide-react";
export function ImagePlaceholder({
  label = "Product image",
  accent = "#26483e",
  className = "",
}: {
  label?: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`placeholder relative grid place-items-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(145deg, ${accent}, #EAE1D2 58%, #F6F1E8)`,
      }}
    >
      <div className="absolute inset-5 border border-white/10" />
      <div className="relative flex flex-col items-center gap-3 text-center text-[#c7ccc9]/65">
        <ImageIcon size={27} strokeWidth={1} />
        <span className="text-[10px] uppercase tracking-[.2em]">{label}</span>
      </div>
    </div>
  );
}
