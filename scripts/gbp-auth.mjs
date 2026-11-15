// One-time helper: get the GBP refresh token for the Google account that manages SatyaSri Realtors.
//   1) node scripts/gbp-auth.mjs url      -> prints the consent URL (open it signed in as Mahesh)
//   2) node scripts/gbp-auth.mjs code <CODE_FROM_REDIRECT>   -> prints the refresh token
// Needs GBP_CLIENT_ID / GBP_CLIENT_SECRET in the environment (OAuth client type "Desktop app").
const id = process.env.GBP_CLIENT_ID, secret = process.env.GBP_CLIENT_SECRET;
const redirect = "http://localhost:8085/";
if (!id || !secret) { console.error("Set GBP_CLIENT_ID and GBP_CLIENT_SECRET first."); process.exit(1); }
const [cmd, code] = process.argv.slice(2);
if (cmd === "url") {
  const q = new URLSearchParams({ client_id: id, redirect_uri: redirect, response_type: "code", access_type: "offline", prompt: "consent", scope: "https://www.googleapis.com/auth/business.manage" });
  console.log("https://accounts.google.com/o/oauth2/v2/auth?" + q);
} else if (cmd === "code" && code) {
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: "authorization_code" }) });
  const j = await r.json(); console.log(j.refresh_token ? "GBP_REFRESH_TOKEN=" + j.refresh_token : j);
} else console.error("usage: url | code <CODE>");
