# Deploying openCare to Vercel

## 1. Create the project

1. Push this repo to GitHub and import it in Vercel (framework: Next.js, root directory: empty).
2. Add a MongoDB Atlas cluster and copy its connection string.

## 2. Environment variables (Production)

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | Long random string (`openssl rand -hex 32`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Your admin login (used by `npm run seed`) |
| `PLATFORM_NAME` | `openCare` |
| `PLATFORM_ROOT_DOMAIN` | Your main domain, e.g. `opencare.com.ng` |
| `SITE_URL` | `https://opencare.com.ng` |
| `LEAD_WHATSAPP` / `LEAD_PHONE` / `LEAD_EMAIL` | Default lead contacts (editable in Admin → Settings) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | Gmail: `smtp.gmail.com`, `587`, your address, an App Password |
| `FIREBASE_STORAGE_BUCKET` / `FIREBASE_SERVICE_ACCOUNT_JSON` | For image uploads (service account JSON on one line) |

Seed once against the production database from your machine:

```bash
MONGODB_URI="<atlas uri>" ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/seed.ts
```

## 3. Platform domain + free client subdomains

In Vercel → Project → Settings → Domains add:

- `opencare.com.ng` (admin + landing page)
- `*.opencare.com.ng` (every client's free subdomain)

Wildcard domains require the domain's **nameservers to point to Vercel**
(`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Vercel shows the exact steps.

## 4. A client's own domain

For each client domain (e.g. `acmepaints.com`):

1. Admin → Clients → the client → **Custom domains**: add `acmepaints.com`.
2. Vercel → Domains: add `acmepaints.com` **and** `www.acmepaints.com`.
3. At the client's registrar:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`
4. Wait for Vercel to show *Valid Configuration*. HTTPS is automatic.

`www.` is matched automatically, so you only list the bare domain in admin.
The admin is never served on client domains — `/admin` there redirects to the platform domain.

## Troubleshooting

- **Client domain shows the openCare landing page** → the domain isn't listed on that client in
  admin, or the client is set to hidden. Changes apply within ~30 seconds.
- **Lead emails not arriving** → check SMTP vars; without them, emails are only logged in Vercel logs.
  Leads are always saved in the admin inbox regardless.
- **Image upload fails** → set `FIREBASE_STORAGE_BUCKET` and `FIREBASE_SERVICE_ACCOUNT_JSON`.
