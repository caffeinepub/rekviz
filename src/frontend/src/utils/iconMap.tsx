import {
  BookOpen,
  Camera,
  Coffee,
  Github,
  Globe,
  Instagram,
  Link2,
  Linkedin,
  Mail,
  MessageCircle,
  Music,
  PenLine,
  Phone,
  Podcast,
  Rss,
  ShoppingBag,
  Twitch,
  Twitter,
  Video,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
  website: Globe,
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  email: Mail,
  coffee: Coffee,
  buymeacoffee: Coffee,
  shop: ShoppingBag,
  store: ShoppingBag,
  blog: BookOpen,
  music: Music,
  video: Video,
  tiktok: Video,
  discord: MessageCircle,
  link: Link2,
  twitch: Twitch,
  rss: Rss,
  phone: Phone,
  podcast: Podcast,
  camera: Camera,
  pen: PenLine,
  portfolio: Camera,
};

export function getIcon(name: string): LucideIcon {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return iconMap[key] ?? Link2;
}
