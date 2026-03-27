import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Settings,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import type { Link } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetLinks, useGetProfile, useIsAdmin } from "../hooks/useQueries";
import { getIcon } from "../utils/iconMap";
import { LinkButton } from "./LinkButton";

const SOCIAL_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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
  discord: MessageCircle,
};

const SAMPLE_LINKS: Link[] = [
  {
    id: 1n,
    title: "Instagram",
    url: "https://www.instagram.com/rekvizofficial/",
    icon: "instagram",
    enabled: true,
  },
  {
    id: 2n,
    title: "YouTube Channel",
    url: "https://www.youtube.com/@DrDonutClippingLove",
    icon: "youtube",
    enabled: true,
  },
  {
    id: 3n,
    title: "Discord",
    url: "https://discord.gg",
    icon: "discord",
    enabled: true,
  },
];

const SAMPLE_PROFILE = {
  name: "REKVIZ",
  handle: "@rekviz",
  bio: "I do clipping professionally",
  avatarUrl:
    "/assets/uploads/grabtapclipping-019d317b-3f2b-7209-91fa-661cbcc4fd7e-1.png",
};

function getSocialLinks(links: Link[]) {
  return links.filter((l) => {
    const key = l.icon.toLowerCase().replace(/[^a-z]/g, "");
    return !!SOCIAL_ICON_MAP[key];
  });
}

interface PublicPageProps {
  onEditClick: () => void;
}

export function PublicPage({ onEditClick }: PublicPageProps) {
  const { data: profile } = useGetProfile();
  const { data: links } = useGetLinks();
  const { data: isAdmin } = useIsAdmin();
  const { login, loginStatus } = useInternetIdentity();

  const displayProfile = profile?.name ? profile : SAMPLE_PROFILE;
  const displayLinks =
    links && links.length > 0 ? links.filter((l) => l.enabled) : SAMPLE_LINKS;

  const socialLinks = getSocialLinks(displayLinks);
  const initials = displayProfile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.965 0.015 85)" }}
    >
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
          style={{
            backgroundColor: "oklch(0.22 0 0)",
            color: "oklch(0.98 0 0)",
          }}
        >
          RK
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {["About", "Projects", "Blog", "Shop", "Contact"].map((item) => (
            <button
              key={item}
              type="button"
              className="text-sm font-medium hover:opacity-70 transition-opacity bg-transparent border-0 cursor-pointer"
              style={{ color: "oklch(0.22 0 0)" }}
              data-ocid={`nav.${item.toLowerCase()}.link`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button
              onClick={onEditClick}
              size="sm"
              className="rounded-full text-sm font-medium"
              style={{
                backgroundColor: "oklch(0.22 0 0)",
                color: "oklch(0.98 0 0)",
              }}
              data-ocid="admin.edit_button"
            >
              <Settings className="w-4 h-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              size="sm"
              className="rounded-full text-sm font-medium"
              style={{
                backgroundColor: "oklch(0.22 0 0)",
                color: "oklch(0.98 0 0)",
              }}
              data-ocid="header.get_in_touch.button"
            >
              Get in Touch
            </Button>
          )}
        </div>
      </header>

      {/* Hero blush band */}
      <section
        className="w-full py-12 px-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.875 0.03 30) 0%, oklch(0.91 0.025 50) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <Avatar
              className="w-44 h-44 md:w-56 md:h-56 border-4 shadow-lg"
              style={{ borderColor: "oklch(0.98 0 0)" }}
            >
              <AvatarImage
                src={displayProfile.avatarUrl}
                alt={displayProfile.name}
              />
              <AvatarFallback
                className="text-2xl font-display"
                style={{
                  backgroundColor: "oklch(0.89 0.025 75)",
                  color: "oklch(0.22 0 0)",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-3 text-center md:text-left"
          >
            <h1
              className="font-display font-bold tracking-widest uppercase"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                color: "oklch(0.22 0 0)",
                letterSpacing: "0.12em",
              }}
            >
              {displayProfile.name}
            </h1>
            <p
              className="font-sans font-semibold text-lg"
              style={{ color: "oklch(0.35 0 0)" }}
            >
              {displayProfile.handle
                ? displayProfile.handle.replace(/^@/, "")
                : "rekviz"}
            </p>
            <p
              className="font-sans text-sm leading-relaxed max-w-md"
              style={{ color: "oklch(0.4 0 0)" }}
            >
              {displayProfile.bio}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <Separator
          className="my-8"
          style={{ backgroundColor: "oklch(0.84 0.012 60)" }}
        />

        <div className="flex flex-col md:flex-row gap-10 pb-16">
          {/* Left sidebar */}
          <aside className="md:w-52 flex-shrink-0 flex flex-col gap-6">
            {/* Social icons */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "oklch(0.45 0 0)" }}
              >
                Stay Connected
              </p>
              <div className="flex flex-wrap gap-2" data-ocid="social.row">
                {(socialLinks.length > 0
                  ? socialLinks
                  : SAMPLE_LINKS.filter((l) => getSocialLinks([l]).length > 0)
                ).map((link) => {
                  const key = link.icon.toLowerCase().replace(/[^a-z]/g, "");
                  const Icon = SOCIAL_ICON_MAP[key];
                  if (!Icon) return null;
                  return (
                    <a
                      key={String(link.id)}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                      style={{
                        backgroundColor: "oklch(0.84 0.012 60)",
                        color: "oklch(0.22 0 0)",
                      }}
                      aria-label={link.title}
                      data-ocid="social.link"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main links column */}
          <main className="flex-1 flex flex-col gap-3" data-ocid="links.list">
            {displayLinks.map((link, i) => {
              const Icon = getIcon(link.icon);
              return (
                <div key={String(link.id)} data-ocid={`links.item.${i + 1}`}>
                  <LinkButton
                    title={link.title}
                    url={link.url}
                    icon={Icon}
                    index={i}
                  />
                </div>
              );
            })}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t py-8 text-center"
        style={{ borderColor: "oklch(0.84 0.012 60)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs"
            style={{
              backgroundColor: "oklch(0.22 0 0)",
              color: "oklch(0.98 0 0)",
            }}
          >
            RK
          </div>
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: "oklch(0.45 0 0)" }}
          >
            <button
              type="button"
              className="hover:opacity-70 transition-opacity bg-transparent border-0 cursor-pointer text-xs"
              style={{ color: "oklch(0.45 0 0)" }}
            >
              Terms
            </button>
            <button
              type="button"
              className="hover:opacity-70 transition-opacity bg-transparent border-0 cursor-pointer text-xs"
              style={{ color: "oklch(0.45 0 0)" }}
            >
              Privacy
            </button>
            <button
              type="button"
              className="hover:opacity-70 transition-opacity bg-transparent border-0 cursor-pointer text-xs"
              style={{ color: "oklch(0.45 0 0)" }}
              data-ocid="footer.contact.button"
            >
              Contact
            </button>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
