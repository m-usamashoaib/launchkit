import { getOptionalUser } from "@/lib/dal";
import { WEEKLY_VISITORS } from "@/lib/analytics";

/** Pro-only CSV export. The plan is checked here too: a hidden button is not security. */
export async function GET() {
  const user = await getOptionalUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (user.plan !== "pro") return Response.json({ error: "CSV export requires the Pro plan" }, { status: 403 });

  const rows = [["week", "visitors", "signups"], ...WEEKLY_VISITORS.map((w) => [w.week, w.visitors, w.signups])];
  return new Response(rows.map((r) => r.join(",")).join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="analytics.csv"',
    },
  });
}
