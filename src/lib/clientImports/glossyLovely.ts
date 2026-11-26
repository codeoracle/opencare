/**
 * Glossy & Lovely Cosmetics — by Green Chemicals Pakistan.
 * Built from the brand's 10 product banners (Nov 2026). Photos in
 * public/clients/glossy-lovely/: one crop per product plus its full banner.
 *
 * Claims are taken from the banners but softened where they would not pass
 * Nigerian advertising norms ("100% dandruff free", "skin lightening",
 * "promotes hair growth"). Product names stay as printed on the packs.
 */
import { runClientImport, type Catalog } from "@/lib/clientImports/runner";

const DIR = "/clients/glossy-lovely";

/** Which banner each product appears on (its full banner is the second photo). */
const BANNER: Record<string, number> = {
  "aloe-vera-face-wash": 1,
  "niacinamide-face-wash": 1,
  "activated-charcoal-face-wash": 5,
  "whitening-serum": 7,
  "vitamin-c-serum": 7,
  "skin-brightening-cream": 8,
  "beauty-cream": 8,
  "cold-cream": 9,
  "almond-and-honey-lotion": 10,
  "cocoa-butter-lotion": 10,
  "natural-anti-hair-loss-shampoo": 4,
  "aloe-vera-and-onion-shampoo": 4,
  "anti-dandruff-shampoo": 4,
  "biotin-keratin-and-silk-protein-conditioner": 2,
  "glossy-hair-oil-spray": 6,
};

const CATALOG: Catalog = {
  "Face Wash": {
    desc: "Soap-free face washes for everyday deep cleansing.",
    items: [
      {
        name: "Aloe Vera Face Wash",
        ingredients: ["Aloe Vera"],
        benefits: ["Deep cleansing", "Natural 2-in-1 formula", "Soap free", "pH skin friendly"],
        note: "Suitable for normal to dry skin.",
        featured: true,
      },
      {
        name: "Niacinamide Face Wash",
        ingredients: ["Niacinamide", "Licorice Extract"],
        benefits: ["Deep cleansing", "Brighter-looking skin", "Soft and smooth feel", "Soap free"],
        note: "Suitable for normal to dry skin.",
        featured: true,
      },
      {
        name: "Activated Charcoal Face Wash",
        ingredients: ["Activated Charcoal"],
        benefits: ["Deep cleansing", "Balances oily skin", "Helps reduce acne", "Improves skin texture"],
        note: "Removes dirt and impurities, leaving skin fresh and clean all day.",
        size: "100 ml",
      },
    ],
  },
  Serums: {
    desc: "Lightweight face serums for an even, glowing complexion.",
    items: [
      {
        name: "Whitening Serum",
        ingredients: [],
        benefits: ["Fades dark spots", "Evens skin tone"],
        note: "Best for oily, combination and acne-prone skin.",
      },
      {
        name: "Vitamin C Serum",
        ingredients: ["Vitamin C", "Hyaluronic Acid"],
        benefits: ["Brightening", "Hydrating", "Glowing skin"],
        note: "Best for oily, combination and acne-prone skin.",
        featured: true,
      },
    ],
  },
  "Face Creams": {
    desc: "Daily creams that moisturise, protect and brighten.",
    items: [
      {
        name: "Skin Brightening Cream",
        ingredients: [],
        benefits: ["Brighter-looking skin", "Smoother skin", "Healthier-looking glow"],
      },
      {
        name: "Beauty Cream",
        ingredients: [],
        benefits: ["Protects and nourishes", "Fades dark spots", "Deep moisturisation", "Brightens skin tone"],
        featured: true,
      },
      {
        name: "Cold Cream",
        ingredients: ["Aloe Vera", "Almond Oil"],
        benefits: ["Deep moisture", "Non-greasy formula", "Soft, smooth and radiant skin"],
        use: "Face and body",
      },
    ],
  },
  "Body Lotions": {
    desc: "Nourishing body lotions for soft, smooth skin.",
    use: "Body",
    items: [
      {
        name: "Almond & Honey Lotion",
        ingredients: ["Almond", "Honey"],
        benefits: ["Moisturises", "Nourishes", "Glowing skin"],
      },
      {
        name: "Cocoa Butter Lotion",
        ingredients: ["Cocoa Butter"],
        benefits: ["Soft skin", "Smooth skin", "Deeply nourished"],
      },
    ],
  },
  "Hair Care": {
    desc: "Glossy Hair shampoos, conditioner and oil spray for all hair types.",
    use: "Hair",
    items: [
      {
        name: "Natural Anti-Hair Loss Shampoo",
        ingredients: ["Ecklonia Cava Extract"],
        benefits: ["Helps reduce hair fall", "Strengthens hair"],
        note: "For all hair types.",
      },
      {
        name: "Aloe Vera & Onion Shampoo",
        ingredients: ["Aloe Vera", "Onion"],
        benefits: ["Moisturises the scalp", "Supports healthy-looking hair"],
        note: "For all hair types.",
      },
      {
        name: "Anti-Dandruff Shampoo",
        ingredients: [],
        benefits: ["Helps control dandruff", "Clean, smooth hair"],
        note: "For all hair types.",
      },
      {
        name: "Biotin Keratin & Silk Protein Conditioner",
        ingredients: ["Biotin", "Keratin", "Silk Protein"],
        benefits: ["Anti-frizz", "Helps reduce hair fall", "Helps prevent damage"],
        size: "200 ml",
        featured: true,
      },
      {
        name: "Glossy Hair Oil Spray",
        ingredients: ["Vitamin E"],
        benefits: ["Tames frizz and flyaways", "Non-oily, non-sticky", "Healthy-looking shine", "Long lasting"],
        note: "Softens, smooths and strengthens hair with a light, refreshing scent.",
      },
    ],
  },
};

export function importGlossyLovely() {
  return runClientImport({
    slugs: ["glossy-lovely"],
    brand: "Glossy & Lovely",
    catalog: CATALOG,
    images: (slug) => (BANNER[slug] ? [`${DIR}/${slug}.jpg`, `${DIR}/banner-${BANNER[slug]}.jpg`] : []),
    tenant: {
      name: "Glossy & Lovely",
      logoUrl: `${DIR}/emblem.jpg`,
      showNameWithLogo: true,
      primaryColor: "#6b2fa0",
      accentColor: "#d6337a",
      headingFont: "serif",
      tagline: "Skincare, haircare and body care by Green Chemicals Pakistan. Quality, trust, innovation.",
      heroEyebrow: "Glossy & Lovely Cosmetics",
      heroTitle: "Everyday beauty, made with care.",
      heroSubtitle:
        "Face washes, serums, creams, body lotions and Glossy Hair care from Green Chemicals Pakistan. Order for yourself, your shop or your salon.",
      heroImage: "",
      aboutTitle: "About Glossy & Lovely",
      aboutIntro: "Quality · Trust · Innovation",
      about:
        "Glossy & Lovely Cosmetics is a brand of Green Chemicals Pakistan, a Pakistan-based manufacturer of beauty and personal care products committed to innovation, quality and customer satisfaction.\n\n" +
        "Through its brands Glossy & Lovely and Zavaan, the company makes skincare, haircare, body care and fragrances designed to enhance everyday beauty and confidence.\n\n" +
        "Its commitment is to deliver high-quality products, build lasting partnerships and create value for customers in local and international markets.",
      aboutImage: "",
      stats: [
        { value: "15", label: "Products available" },
        { value: "5", label: "Product ranges" },
        { value: "2", label: "Brands: Glossy & Lovely, Zavaan" },
        { value: "B2B & Retail", label: "Service model" },
      ],
      highlights: [
        { title: "Complete beauty range", desc: "Face, body and hair care from one trusted manufacturer." },
        { title: "Gentle, skin-friendly formulas", desc: "Soap-free, pH-friendly face washes and non-greasy creams." },
        { title: "Retail and wholesale", desc: "Order single products or stock your shop, salon or pharmacy." },
      ],
      audiences: ["Beauty shops & pharmacies", "Salons", "Supermarkets", "Online sellers", "Families", "Distributors"],
      faqs: [
        {
          q: "How do I get prices?",
          a: "Send an enquiry from any product page or message us on WhatsApp with the products and quantities you need. We'll reply with pricing and delivery options.",
        },
        {
          q: "Can I buy wholesale for my shop?",
          a: "Yes. We supply beauty shops, salons, pharmacies and online sellers. Apply on the Become a Distributor page or send us a message.",
        },
        { q: "Where are the products made?", a: "By Green Chemicals Pakistan, the manufacturer behind Glossy & Lovely and Zavaan." },
      ],
      distributorIntro:
        "Stock Glossy & Lovely in your shop, salon or online store. We support distributors with wholesale pricing and help choosing the right products for your customers.",
      distributorBenefits: [
        { title: "Wholesale pricing", desc: "Better margins on bulk orders." },
        { title: "Everyday best-sellers", desc: "Face washes, creams, lotions and hair care customers buy again and again." },
        { title: "Marketing support", desc: "Product photos and banners for your shop and social media." },
      ],
      footerBlurb: "Glossy & Lovely Cosmetics by Green Chemicals Pakistan. Your trusted partner in beauty and personal care.",
      currency: "NGN",
      showPrices: false,
      enableDistributors: true,
      metaTitle: "Glossy & Lovely Cosmetics: Face, Body & Hair Care",
      metaDescription:
        "Shop Glossy & Lovely face washes, vitamin C serum, beauty and cold creams, body lotions and Glossy Hair shampoos. Retail and wholesale.",
    },
  });
}
