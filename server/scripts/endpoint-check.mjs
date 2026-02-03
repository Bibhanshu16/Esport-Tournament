const baseUrl = process.env.API_BASE_URL || "http://localhost:5000/api";
const userToken = process.env.USER_TOKEN || "";
const adminToken = process.env.ADMIN_TOKEN || "";

const endpoints = [
  { method: "GET", path: "/tournaments/active", auth: false },
  { method: "GET", path: "/tournaments", auth: false },
  { method: "GET", path: "/auth/me", auth: true, role: "user" },
  { method: "GET", path: "/registrations/me", auth: true, role: "user" },
  { method: "GET", path: "/admin/pending-registrations", auth: true, role: "admin" },
  { method: "GET", path: "/admin/registrations?status=APPROVED", auth: true, role: "admin" },
  { method: "GET", path: "/admin/registrations?status=REJECTED", auth: true, role: "admin" },
];

function getAuthHeader(role) {
  if (role === "admin") return adminToken ? { Authorization: `Bearer ${adminToken}` } : null;
  return userToken ? { Authorization: `Bearer ${userToken}` } : null;
}

async function run() {
  console.log(`API base: ${baseUrl}`);
  let failed = 0;

  for (const ep of endpoints) {
    const url = `${baseUrl}${ep.path}`;
    const headers = { "Content-Type": "application/json" };
    if (ep.auth) {
      const authHeader = getAuthHeader(ep.role);
      if (!authHeader) {
        console.log(`[SKIP] ${ep.method} ${url} (missing ${ep.role?.toUpperCase() || "USER"}_TOKEN)`);
        continue;
      }
      Object.assign(headers, authHeader);
    }

    try {
      const res = await fetch(url, { method: ep.method, headers });
      const ok = res.ok ? "OK" : `FAIL ${res.status}`;
      console.log(`[${ok}] ${ep.method} ${url}`);
      if (!res.ok) failed += 1;
    } catch (err) {
      failed += 1;
      console.log(`[ERROR] ${ep.method} ${url} - ${err.message}`);
    }
  }

  if (failed) {
    console.log(`\nEndpoint check finished with ${failed} failure(s).`);
    process.exit(1);
  }
  console.log("\nEndpoint check finished successfully.");
}

run();
