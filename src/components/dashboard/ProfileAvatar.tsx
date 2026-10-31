import { User } from "lucide-react";

const AVATAR_COLORS: Record<string, string> = {
  primary: "var(--gradient-primary)",
  green: "var(--gradient-green)",
  violet: "var(--gradient-violet)",
  amber: "var(--gradient-amber)",
  rose: "var(--gradient-rose)",
  sky: "var(--gradient-sky)",
};

export { AVATAR_COLORS };

export function ProfileAvatar({
  photoURL,
  avatarColor,
  name,
  size = 56,
}: {
  photoURL?: string | null;
  avatarColor?: string | null;
  name?: string | null;
  size?: number;
}) {
  const style = { width: size, height: size };

  if (photoURL) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoURL}
        alt={name || "Profile photo"}
        style={style}
        className="rounded-full object-cover border-2 border-white/70 shrink-0 aspect-square"
      />
    );
  }

  if (avatarColor && AVATAR_COLORS[avatarColor]) {
    const initials =
      (name || "")
        .split(" ")
        .map((s) => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";
    return (
      <div
        style={{ ...style, backgroundImage: AVATAR_COLORS[avatarColor] }}
        className="rounded-full flex items-center justify-center text-white font-semibold border-2 border-white/70 shrink-0 aspect-square"
      >
        <span style={{ fontSize: size * 0.36 }}>{initials}</span>
      </div>
    );
  }

  return (
    <div
      style={style}
      className="rounded-full bg-white/15 border-2 border-white/70 flex items-center justify-center text-white shrink-0 aspect-square"
    >
      <User size={size * 0.5} strokeWidth={1.75} />
    </div>
  );
}
