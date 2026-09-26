import { useState } from "react";
import { useCarbonFootprint } from "react-carbon-footprint";
import { Leaf, ChevronDown, ChevronUp, Activity, HardDrive } from "lucide-react";

export default function CarbonFootprintDisplay() {
  const [gCO2, bytesTransferred] = useCarbonFootprint();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formattedCO2 =
    gCO2 !== undefined && gCO2 !== null
      ? gCO2 < 0.001 && gCO2 > 0
        ? `${(gCO2 * 1000).toFixed(2)} mg`
        : `${gCO2.toFixed(4)} g`
      : "0.0000 g";

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 bg-tp-card/90 backdrop-blur-md border border-tp-border hover:border-emerald-500/50 rounded-full shadow-lg text-tp-text hover:text-emerald-400 transition-all cursor-pointer text-xs group"
          title="Click to view carbon footprint details"
        >
          <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <Leaf size={14} />
          </span>
          <span className="font-medium text-emerald-400">{formattedCO2}</span>
          <span className="text-tp-secondary">CO₂e</span>
          <ChevronUp size={14} className="text-tp-muted ml-0.5" />
        </button>
      ) : (
        <div className="w-64 bg-tp-card/95 backdrop-blur-md border border-tp-border rounded-xl shadow-2xl p-4 text-tp-text animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-tp-border">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                <Leaf size={16} />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-tp-text">Carbon Footprint</h4>
                <p className="text-[10px] text-tp-secondary">Network transfer emissions</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-tp-input rounded-md text-tp-secondary hover:text-tp-text transition-colors cursor-pointer"
              title="Minimize"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs bg-tp-input/50 p-2.5 rounded-lg border border-tp-border/60">
              <span className="flex items-center gap-1.5 text-tp-secondary">
                <Activity size={13} className="text-emerald-400" />
                Emissions
              </span>
              <span className="font-semibold text-emerald-400">
                {formattedCO2} <span className="font-normal text-[10px] text-tp-secondary">CO₂e</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs bg-tp-input/50 p-2.5 rounded-lg border border-tp-border/60">
              <span className="flex items-center gap-1.5 text-tp-secondary">
                <HardDrive size={13} className="text-tp-accent" />
                Data Transferred
              </span>
              <span className="font-mono text-tp-text text-xs">
                {formatBytes(bytesTransferred)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-tp-border/50 text-[10px] text-tp-muted text-center">
            Calculated via Sustainable Web Design model
          </div>
        </div>
      )}
    </div>
  );
}
