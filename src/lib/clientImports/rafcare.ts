/**
 * RAFCARE client import — a brand of AFCARE (Guangzhou Aifujia Biotechnology
 * Co., Ltd.). Built from AFCARE's Ready Stock Catalog. Products are matched
 * by slug and updated in place, so this is safe to run again.
 *
 * Used by `npm run client:rafcare` and by Admin → Clients → "Import RAFCARE".
 * Photos live in public/clients/rafcare/.
 */
import { runClientImport, type Catalog } from "@/lib/clientImports/runner";
import manifest from "../../../public/clients/rafcare/manifest.json";



// Benefits are worded as "brightening / evens tone / fades dark spots" rather
// than "whitening" to suit the Nigerian market and NAFDAC advertising norms.
const CATALOG: Catalog = {
  "Face Serums": {
    desc: "Targeted serums and ampoules for hydration, brightening, acne and anti-ageing.",
    items: [
      { name: "Hyaluronic Acid Serum", ingredients: ["Hyaluronic Acid", "Chamomile", "Aloe Vera"], benefits: ["Deep moisturizing", "Brightening"] },
      { name: "Turmeric Serum", ingredients: ["Turmeric", "Niacinamide", "Hyaluronic Acid"], benefits: ["Fades dark spots", "Brightening", "Moisturizing"] },
      { name: "Retinol Serum", ingredients: ["Retinol", "Niacinamide", "Hyaluronic Acid"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "24K Gold Serum", ingredients: ["Hyaluronic Acid", "Gold Leaf"], benefits: ["Hydrating", "Brightening", "Firming"] },
      { name: "PDRN Collagen Peptide Serum", ingredients: ["Hyaluronic Acid", "PDRN", "Retinol"], benefits: ["Hydration", "Brightening", "Smoothing"] },
      { name: "Oligopeptide Serum", ingredients: ["Oligopeptide-1", "Salicylic Acid", "Hyaluronic Acid"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
      { name: "Boseine Serum", ingredients: ["Boseine", "Niacinamide", "Hyaluronic Acid"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Q10 Serum", ingredients: ["Coenzyme Q10", "Sunflower Seed Oil", "Hyaluronic Acid"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Vitamin C Magic Serum", ingredients: ["Vitamin C", "Hyaluronic Acid", "Collagen"], benefits: ["Hydration", "Brightening", "Anti-wrinkle"], featured: true },
      { name: "Rose Spray", ingredients: ["Rose", "Witch Hazel", "Aloe Vera"], benefits: ["Moisturizing", "Anti-ageing", "Soothing"] },
      { name: "Milk Essence Ampoules", ingredients: ["Milk", "Ceramide NP", "Hyaluronic Acid"], benefits: ["Antioxidant", "Hydrating", "Softening"] },
      { name: "PDRN Essence Ampoules", ingredients: ["Salmon DNA PDRN", "Niacinamide", "Hyaluronic Acid"], benefits: ["Repairing", "Brightening", "Improves elasticity"] },
      { name: "Centella Asiatica Essence Ampoules", ingredients: ["Hyaluronic Acid", "Centella Asiatica", "Vitamin B5"], benefits: ["Smoothing", "Moisturizing", "Brightening"] },
      { name: "Lactobionic Acid Serum", ingredients: ["Lactobionic Acid", "Niacinamide", "Hyaluronic Acid"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
      { name: "Arbutin Serum", ingredients: ["Niacinamide", "Alpha-Arbutin"], benefits: ["Fades dark spots", "Evens skin tone", "Moisturizing"] },
      { name: "Salicylic Acid Serum", ingredients: ["Salicylic Acid", "Squalane", "Vitamin E"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
      { name: "Kojic Acid Serum", ingredients: ["Kojic Acid", "Niacinamide", "Retinol"], benefits: ["Fades dark spots", "Evens skin tone", "Moisturizing"], featured: true },
      { name: "Rose Water Oil Serum", ingredients: ["Rose", "Collagen", "Squalane"], benefits: ["Repairing", "Brightening", "Moisturizing"] },
      { name: "Tea Tree Serum", ingredients: ["Tea Tree", "Salicylic Acid", "Hyaluronic Acid"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
      { name: "Niacinamide Serum", ingredients: ["Niacinamide", "Salicylic Acid", "Ceramide NP"], benefits: ["Hydration", "Brightening", "Repairing"], featured: true },
      { name: "Deep Nourishing Repairing Serum", ingredients: ["Ceramides", "Hyaluronic Acid", "Collagen"], benefits: ["Repairing", "Anti-wrinkle", "Hydration"] },
      { name: "Reduce Wrinkles Collagen Serum", ingredients: ["Collagen", "Paeonia Albiflora Root Extract", "Hyaluronic Acid"], benefits: ["Anti-wrinkle", "Smoothing", "Improves skin texture"] },
    ],
  },
  "Face Creams": {
    desc: "Day, night and treatment creams for every skin concern.",
    items: [
      { name: "Men's Facial Cream", ingredients: ["Avocado", "Hyaluronic Acid", "Retinol"], benefits: ["Moisturizing"] },
      { name: "Anti-Acne Cream", ingredients: ["Squalane", "Portulaca Extract", "Tea Tree"], benefits: ["Helps clear acne", "Controls oil", "Improves skin texture"] },
      { name: "Kojic Acid Cream", ingredients: ["Kojic Acid", "Niacinamide", "Hyaluronic Acid"], benefits: ["Fades dark spots", "Evens skin tone", "Moisturizing"] },
      { name: "Astaxanthin Cream", ingredients: ["Collagen", "Astaxanthin"], benefits: ["Brightening", "Moisturizing", "Reduces wrinkles"] },
      { name: "Turmeric Face Cream", ingredients: ["Turmeric", "Niacinamide", "Hyaluronic Acid"], benefits: ["Fades dark spots", "Brightening", "Moisturizing"], featured: true },
      { name: "Retinol Cream", ingredients: ["Retinol", "Hyaluronic Acid", "Collagen"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Calendula Cream", ingredients: ["Hyaluronic Acid", "Salicylic Acid", "Calendula Officinalis"], benefits: ["Helps treat acne", "Oil control"] },
      { name: "Arbutin Cream", ingredients: ["Niacinamide", "Alpha-Arbutin"], benefits: ["Fades dark spots", "Evens skin tone", "Moisturizing"] },
      { name: "Lactobionic Acid Cream", ingredients: ["Lactobionic Acid", "Niacinamide", "Salicylic Acid"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
      { name: "5% Retinol Collagen Cream", ingredients: ["Retinol", "Collagen", "Hyaluronic Acid"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "8% Retinol Collagen Cream", ingredients: ["Retinol", "Collagen", "Hyaluronic Acid"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Peptide Cream", ingredients: ["Coenzyme Q10", "Peptide Complex", "Hyaluronic Acid"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Whitening Cream", ingredients: ["Niacinamide", "Arbutin", "Sodium Hyaluronate"], benefits: ["Brightening", "Evens skin tone", "Moisturizing"] },
      { name: "Q10 Day Cream", ingredients: ["Glycerol", "Coenzyme Q10"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Q10 Night Cream", ingredients: ["Niacinamide", "Hyaluronic Acid", "Coenzyme Q10"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Glutathione Cream", ingredients: ["Glutathione", "Hyaluronic Acid", "Niacinamide"], benefits: ["Reduces wrinkles", "Brightening", "Moisturizing"] },
      { name: "Tea Tree Cream", ingredients: ["Hyaluronic Acid", "Camellia", "Tea Tree"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
      { name: "Oligopeptide Cream", ingredients: ["Oligopeptides", "Ceramides"], benefits: ["Helps clear acne", "Brightening", "Moisturizing"] },
    ],
  },
  "Eye Care": {
    desc: "Eye creams for fine lines, puffiness and dark circles.",
    items: [
      { name: "Electric Massage Eye Cream", ingredients: ["Collagen", "Hyaluronic Acid", "Caffeine"], benefits: ["Reduces wrinkles", "Moisturizing", "Reduces under-eye bags"] },
      { name: "6% Caffeine Anti-Wrinkle Eye Cream", ingredients: ["Retinol", "Caffeine"], benefits: ["Deep hydration", "Anti-ageing", "Reduces dark circles"] },
    ],
  },
  "Masks & Patches": {
    desc: "Clay, mud and peel-off masks plus targeted patches.",
    items: [
      { name: "Forehead Wrinkle Patch", ingredients: ["Vitamin E", "Sweet Almond Oil", "Hyaluronic Acid"], benefits: ["Smooths forehead lines", "Brightening", "Moisturizing"] },
      { name: "Clay Masks Kit", ingredients: ["Rose + Vitamin C", "Turmeric", "Dead Sea Mud", "Green Tea"], benefits: ["Smoothing", "Brightening", "Pore cleansing"] },
      { name: "Collagen Peel Off Mask", ingredients: ["Collagen", "Niacinamide", "Purslane Extract"], benefits: ["Rapid absorption", "Deep cleansing", "Nourishes skin"] },
      { name: "Dead Sea Mud Mask", ingredients: ["Sea Mud", "Kaolin", "Niacinamide"], benefits: ["Hydration", "Brightening", "Exfoliation"] },
    ],
  },
  Sunscreen: {
    desc: "Broad-spectrum SPF 50+ sun protection.",
    items: [
      { name: "Sunscreen Cream SPF 50+", ingredients: ["Cassia Alata Leaf Extract"], benefits: ["SPF 50+ PA++++", "UVA + UVB protection"] },
      { name: "Calendula Sunscreen SPF 50+", ingredients: ["Centella Asiatica", "Chamomile", "Aloe Vera"], benefits: ["SPF 50+ PA++++", "UVA + UVB protection", "Soothing"] },
    ],
  },
  "Body Care": {
    desc: "Lotions, scrubs, balms and treatments for smooth, even skin.",
    use: "Body",
    items: [
      { name: "Neck Firming Cream", ingredients: ["Vitamin E", "Sweet Almond Oil", "Hyaluronic Acid"], benefits: ["Reduces neck lines", "Brightening", "Moisturizing"] },
      { name: "Underarm Detox Scrub", ingredients: ["Turmeric Root", "Niacinamide", "Vitamin C"], benefits: ["Deodorizing", "Detoxifying", "Exfoliating"] },
      { name: "Cherry Body Scrub", ingredients: ["Cherry", "Hyaluronic Acid"], benefits: ["Exfoliation", "Brightening"] },
      { name: "Coconut Body Scrub", ingredients: ["Coconut", "Hyaluronic Acid"], benefits: ["Exfoliation", "Brightening"] },
      { name: "Vitamin C Body Lotion", ingredients: ["Vitamin C", "Ceramide NP", "Vitamin E"], benefits: ["Brightening", "Moisturizing", "Restores elasticity"] },
      { name: "Collagen Body Lotion", ingredients: ["Collagen", "Hyaluronic Acid", "Niacinamide"], benefits: ["Deep moisturizing", "Improves skin tone", "Anti-ageing"] },
      { name: "Turmeric Body Lotion", ingredients: ["Turmeric", "Niacinamide", "Hyaluronic Acid"], benefits: ["Body moisturizing", "Smooth skin"] },
      { name: "Hair Removal Set", ingredients: ["Licorice", "Ceramide NP", "Gentian Root"], benefits: ["Softens hair", "Repairing", "Moisturizing", "Painless hair removal"] },
      { name: "Body Balm", ingredients: ["Beeswax", "Glycerin", "Kaolin"], benefits: ["Moisturizing", "Long-lasting fragrance"] },
      { name: "Premium Massage Cream", ingredients: ["Purslane", "Gentian Root", "Golden Chamomile"], benefits: ["Moisturizing", "Relaxes muscles", "Relieves leg discomfort"] },
    ],
  },
  Cleansers: {
    desc: "Gentle foaming cleansers and mousses.",
    items: [
      { name: "Amino Acid Cleansing Mousse", ingredients: ["Collagen", "Hyaluronic Acid"], benefits: ["Gently cleanses", "Moisturizing", "Repairing"] },
      { name: "Bifida Ferment Lysate Cleansing Mousse", ingredients: ["Bifida Ferment Lysate", "Niacinamide", "Sodium Hyaluronate"], benefits: ["Cleanses", "Soothes", "Moisturizing"] },
      { name: "Pore-Cleansing Facial Cleanser", ingredients: ["Vitamin C", "Astaxanthin", "Niacinamide"], benefits: ["Deep cleansing", "Oil control", "Softens skin"] },
      { name: "Intimate Gel Cranberry", ingredients: ["Camellia", "Cranberry", "Hyaluronic Acid"], benefits: ["Gentle cleansing", "Moisturizing", "Maintains natural balance"] },
      { name: "Microbiome Balance Cleansing Mousse", ingredients: ["Lactobacillus Ferment Lysate", "Niacinamide"], benefits: ["Cleanses", "Controls oil"] },
    ],
  },
  "Dry Flower Oils": {
    desc: "Natural petal multi-use oils for face, body and hair.",
    items: ["Lily", "Saffron", "Rosemary", "Lavender", "Jasmine"].map((flower) => ({
      name: `${flower} Natural Petal Multi-Use Oil`,
      ingredients: [`Dried ${flower} Flower`, `${flower} Essential Oil`],
      benefits: ["Nourishing", "Moisturizing", "Pleasant fragrance"],
      use: "Face / Body / Hair",
      size: "60ml",
    })),
  },
};

/** Create or update the RAFCARE client and its catalogue. Safe to re-run. */
export async function importRafcare() {
  const images = manifest as Record<string, string[]>;
  const asset = (name: string) => (images[`_${name}`]?.[0] ? images[`_${name}`][0] : "");

  const tenantFields = {
    name: "RAFCARE",
    logoUrl: asset("logo"),
    primaryColor: "#60774e",
    accentColor: "#2f9e7f",
    headingFont: "serif" as const,
    tagline: "Professional skincare made in a GMPC-certified facility. Serums, creams, masks and body care.",
    heroEyebrow: "Professional skincare · Since 2008",
    heroTitle: "Grasp every opportunity to become beautiful.",
    heroSubtitle:
      "Serums, creams, masks, cleansers and body care from RAFCARE, backed by over 15 years of skincare expertise. Order for yourself, your shop or your clients.",
    heroImage: asset("hero"),
    aboutTitle: "About RAFCARE",
    aboutIntro: "Focused on skincare solutions for more than 15 years.",
    about:
      "RAFCARE is a skincare brand from AFCARE (Guangzhou Aifujia Biotechnology Co., Ltd.), a manufacturer that has focused on skincare since 2008. The company's office is in Guangzhou, China, and its factory sits in Foshan, in the heart of the Guangdong–Hong Kong–Macao Greater Bay Area.\n\n" +
      "The 50,000 m² factory has a research and development centre of more than 1,000 m², a 100,000-level GMPC-certified dust-free production workshop and a standard testing system, with a team of more than 500 people.\n\n" +
      "AFCARE makes high-end, mid-range and specialist skincare for daily-care, professional, e-commerce and direct-sales brands around the world, and offers OEM, ODM and OBM (private label) services.",
    aboutImage: asset("about"),
    stats: [
      { value: "2008", label: "Founded" },
      { value: "50,000 m²", label: "Manufacturing facility" },
      { value: "500+", label: "Employees" },
      { value: "1,000 m²+", label: "R&D centre" },
    ],
    highlights: [
      { title: "GMPC-certified production", desc: "Made in a 100,000-level dust-free workshop with a full testing system." },
      { title: "15+ years of formulation", desc: "Proven actives like niacinamide, retinol, kojic acid, vitamin C and PDRN." },
      { title: "Wide ready-stock range", desc: "Face, eye, body, cleansing and sun care, all from one manufacturer." },
      { title: "Private label available", desc: "OEM / ODM / OBM services through our parent company AFCARE if you want these formulas under your own brand." },
    ],
    audiences: ["Skincare lovers", "Beauty shops & pharmacies", "Spas & estheticians", "Online sellers", "Salons", "Distributors"],
    faqs: [
      {
        q: "How do I get prices?",
        a: "Send an enquiry from any product page or message us on WhatsApp with the products and quantities you need. We'll reply with pricing and delivery options.",
      },
      {
        q: "Can I buy wholesale for my shop?",
        a: "Yes. We supply beauty shops, pharmacies, spas and online sellers. Apply on the Become a Distributor page or send us a message.",
      },
      {
        q: "Can you make products under my own brand?",
        a: "Yes. Through our parent company AFCARE we offer OEM, ODM and OBM (private label) services. Contact us with your product idea and quantities.",
      },
      {
        q: "Where are the products made?",
        a: "In the GMPC-certified factory of our parent company AFCARE in Foshan, Guangdong, China.",
      },
    ],
    distributorIntro:
      "Stock RAFCARE in your shop, salon or online store. We support distributors with wholesale pricing and help choosing the right products for your customers.",
    distributorBenefits: [
      { title: "Wholesale pricing", desc: "Better margins on bulk orders." },
      { title: "Broad, proven range", desc: "Serums, creams, body care and cleansers customers ask for." },
      { title: "Private label option", desc: "Grow into your own brand with AFCARE's OEM/ODM service." },
    ],
    footerBlurb: "RAFCARE professional skincare. A brand of AFCARE (Guangzhou Aifujia Biotechnology Co., Ltd.), skincare specialists since 2008.",
    currency: "NGN",
    showPrices: false,
    enableDistributors: true,
    metaTitle: "RAFCARE Skincare: Serums, Creams & Body Care",
    metaDescription:
      "Shop RAFCARE professional skincare: vitamin C, niacinamide, kojic acid and retinol serums, face creams, masks, sunscreen and body care. Retail and wholesale.",
  };

  return runClientImport({
    // Also matches the earlier "afcare" record, so re-running renames it in place.
    slugs: ["rafcare", "afcare"],
    brand: "RAFCARE",
    tenant: tenantFields,
    catalog: CATALOG,
    images: (slug) => images[slug] || [],
  });
}
