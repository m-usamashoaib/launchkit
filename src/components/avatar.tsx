/* eslint-disable @next/next/no-img-element -- avatars come from arbitrary OAuth hosts */
export function Avatar({ name, image, size = 36 }: { name: string; image?: string | null; size?: number }) {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return image ? (
    <img src={image} alt="" width={size} height={size} className="rounded-full border border-line" referrerPolicy="no-referrer" />
  ) : (
    <span
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-xs font-bold text-white"
      aria-hidden
    >
      {initials}
    </span>
  );
}
