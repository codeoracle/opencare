/**
 * Seeds the admin login, openCare platform settings and (only when no clients
 * exist yet) one demo client so there is something to look at.
 *
 *   npm run seed
 */
import { connectDB } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { Admin } from "../src/models/Admin";
import { Platform } from "../src/models/Platform";
import { Tenant } from "../src/models/Tenant";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";
import { createSlug } from "../src/lib/utils";

async function seed() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 8) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (8+ characters) in .env.local before seeding.");
  }

  await Admin.updateOne(
    { email: adminEmail },
    { $set: { email: adminEmail, name: "Admin", password: await hashPassword(adminPassword) } },
    { upsert: true }
  );
  console.log(`✓ Admin login: ${adminEmail}`);

  await Platform.updateOne(
    { key: "default" },
    {
      $setOnInsert: {
        key: "default",
        name: process.env.PLATFORM_NAME || "openCare",
        leadWhatsApp: process.env.LEAD_WHATSAPP || "",
        leadPhone: process.env.LEAD_PHONE || process.env.LEAD_WHATSAPP || "",
        leadEmail: process.env.LEAD_EMAIL || "",
      },
    },
    { upsert: true }
  );
  console.log("✓ Platform settings");

  // Make sure tenant-scoped unique indexes exist before inserting.
  await Promise.all([Tenant.syncIndexes(), Category.syncIndexes(), Product.syncIndexes()]);

  if ((await Tenant.countDocuments()) > 0) {
    console.log("• Clients already exist — skipping demo client");
    return;
  }

  const tenant = await Tenant.create({
    name: "Demo Manufacturer",
    slug: "demo",
    domains: [],
    primaryColor: "#0f766e",
    accentColor: "#ea580c",
    headingFont: "sans",
    tagline: "Quality building materials, delivered nationwide.",
    heroEyebrow: "Building materials · Nigeria",
    heroTitle: "Built to last.",
    heroSubtitle:
      "Roofing, tiles and finishing products for contractors, developers and homeowners. Request a quote in minutes.",
    aboutTitle: "Trusted by builders across Nigeria",
    aboutIntro: "This is a demo client. Edit everything here from the openCare admin.",
    about:
      "Demo Manufacturer produces durable building materials for residential and commercial projects.\n\nThis text, the colours, logo and every section on this site can be changed from Admin → Clients.",
    stats: [
      { value: "15+", label: "Years in business" },
      { value: "36", label: "States covered" },
      { value: "B2B & Retail", label: "Service model" },
      { value: "48h", label: "Typical delivery" },
    ],
    highlights: [
      { title: "Factory-direct pricing", desc: "Buy straight from the manufacturer's distribution partner." },
      { title: "Project-ready supply", desc: "From single orders to full-site bulk supply." },
      { title: "Fast follow-up", desc: "Send an enquiry or continue on WhatsApp for quick quotes." },
    ],
    audiences: ["Contractors", "Real estate developers", "Retail shops", "Homeowners"],
    faqs: [
      { q: "Do you deliver nationwide?", a: "Yes, we deliver to all 36 states." },
      { q: "Can I order in bulk?", a: "Yes. Send an enquiry from any product page for bulk pricing." },
    ],
    location: "Lagos, Nigeria",
    currency: "NGN",
    showPrices: true,
    enableDistributors: true,
  });

  const categories = await Category.insertMany(
    ["Roofing", "Tiles", "Finishing"].map((name) => ({
      tenant: tenant._id,
      name,
      slug: createSlug(name),
      isActive: true,
    }))
  );
  const cat = (name: string) => categories.find((c) => c.name === name)!._id;

  const products = [
    {
      name: "Aluminium Roofing Sheet 0.55mm",
      category: cat("Roofing"),
      price: 9500,
      shortDescription: "Long-span, corrosion-resistant roofing sheet.",
      description: "Long-span aluminium roofing sheet suitable for homes and warehouses. Priced per metre.",
      specs: [
        { label: "Gauge", value: "0.55mm" },
        { label: "Finish", value: "Stone-coated" },
      ],
      features: ["Rust-proof", "10-year warranty"],
      isFeatured: true,
    },
    {
      name: "Porcelain Floor Tile 60×60",
      category: cat("Tiles"),
      price: 14500,
      shortDescription: "Polished porcelain tile, sold per carton.",
      description: "Polished porcelain floor tile for living rooms and offices. 4 pieces per carton (1.44m²).",
      specs: [{ label: "Size", value: "600 × 600mm" }],
      features: ["Scratch-resistant", "Low water absorption"],
      isFeatured: true,
    },
    {
      name: "Exterior Wall Paint 20L",
      category: cat("Finishing"),
      price: 52000,
      shortDescription: "Weatherproof emulsion for outside walls.",
      description: "Weatherproof exterior emulsion with UV protection. Available in 30 colours.",
      features: ["Washable", "Anti-fungal"],
      isFeatured: true,
    },
    {
      name: "Custom Roofing Accessories",
      category: cat("Roofing"),
      shortDescription: "Ridges, flashings and gutters made to order.",
      description: "Made-to-order ridges, flashings and gutters. Send your measurements for a quote.",
      isFeatured: false,
    },
  ];

  await Product.insertMany(
    products.map((p) => ({ ...p, tenant: tenant._id, slug: createSlug(p.name), images: [], isActive: true }))
  );

  console.log(`✓ Demo client "${tenant.name}" with ${products.length} products`);
  console.log("  Preview it at http://localhost:3000/?client=demo or http://demo.localhost:3000");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
