import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface LinkButtonProps {
  title: string;
  url: string;
  icon: LucideIcon;
  index: number;
}

export function LinkButton({ title, url, icon: Icon, index }: LinkButtonProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
      className="flex items-center gap-4 w-full rounded-full px-4 py-3 shadow-pill hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      style={{ backgroundColor: "oklch(0.805 0.012 240)" }}
    >
      <span
        className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: "oklch(0.89 0.025 75)" }}
      >
        <Icon className="w-5 h-5" style={{ color: "oklch(0.22 0 0)" }} />
      </span>
      <span
        className="font-semibold text-base flex-1 text-center pr-10"
        style={{ color: "oklch(0.22 0 0)" }}
      >
        {title}
      </span>
    </motion.a>
  );
}
