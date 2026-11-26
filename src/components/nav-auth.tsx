import { getOptionalUser } from "@/lib/dal";
import { ButtonLink } from "./ui";
import { Avatar } from "./avatar";

export async function NavAuth() {
  const user = await getOptionalUser();
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <ButtonLink href="/login" variant="ghost">Log in</ButtonLink>
        <ButtonLink href="/signup">Get started</ButtonLink>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <ButtonLink href="/dashboard" variant="secondary">Dashboard</ButtonLink>
      <Avatar name={user.name} image={user.image} />
    </div>
  );
}
