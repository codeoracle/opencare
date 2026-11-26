# openCare

One platform that runs a **product catalogue + lead site for every manufacturer client**.
Each client gets their own branded site on their own domain (or a free subdomain), and every
enquiry, distributor application and contact message lands in one openCare lead inbox.

## How it works

- **One app, one database.** Each request's domain decides which client's site is shown:
  - `acmepaints.com` → the client with that custom domain
  - `acme.<PLATFORM_ROOT_DOMAIN>` → the client with subdomain `acme`
  - the platform domain itself → openCare landing page + `/admin`
- **Everything is scoped by client.** Products, brands, categories and leads all carry a
  `tenant` id; every query filters on it.
- **Leads go to you.** WhatsApp buttons and lead emails use the openCare contacts from
  Admin → Settings, unless a client has its own override.

## Stack

Next.js 15 (App Router) · MongoDB/Mongoose · Tailwind v4 · Nodemailer · Firebase Storage (images) · JWT cookie auth

## Local setup

```bash
npm install
cp .env.example .env.local      # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed                    # admin login, platform settings, one demo client
npm run dev
```

- Admin: http://localhost:3000/admin/login
- Demo client: http://demo.localhost:3000 (Chrome/Firefox resolve `*.localhost` automatically)
  or http://localhost:3000/?client=demo (preview cookie; `?client=` clears it)

## Admin

| Screen | What it does |
| --- | --- |
| **Leads** | All leads from all clients. Filter by client/type/status, mark *contacted → forwarded → closed*, add notes, copy details to forward to the manufacturer. |
| **Clients** | Add a client (name + subdomain + optional domain). Edit branding, colours, page text, FAQs, currency, price visibility, contact overrides, SEO and Facebook Pixel. |
| **Products / Brands / Categories** | The catalogue of the client picked in the top-right switcher. Price, brand and category are optional. |
| **Settings** | Platform name, lead email, default WhatsApp/phone. |

## Client setup scripts

Clients can be set up entirely in the admin, or from a script when there's a big catalogue to import:

| Client | Command | Source |
| --- | --- | --- |
| RAFCARE (brand of AFCARE / Guangzhou Aifujia Biotechnology) | `npm run client:rafcare` | AFCARE Ready Stock Catalog PDF — 68 products, photos in `public/clients/rafcare/` |
| Glossy & Lovely (Green Chemicals Pakistan) | `npm run client:glossy-lovely` | 10 product banners — 15 products, photos in `public/clients/glossy-lovely/` |

Scripts are safe to re-run; they update the client and its products in place.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel + domain setup and
[docs/USER_GUIDE.md](docs/USER_GUIDE.md) for onboarding a new client.
