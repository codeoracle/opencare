/**
 * BILEF — body care brand by YASS Cosmetic. Built from "BILEF Catalog202608"
 * (26 pages). Photos are the catalogue's own product images, in
 * public/clients/bilef/ (file name = product slug).
 *
 * Product names follow the packs; where the same scent name appears in several
 * series (Extra Bright, Aloe Vera, Cool Fresh, Passion Charm) the format is added
 * so every product has its own page. "Whitening" claims are worded as
 * brightening / evens tone to suit Nigerian advertising norms.
 */
import { runClientImport, type Catalog, type CatalogItem } from "@/lib/clientImports/runner";

const DIR = "/clients/bilef";

const rollOn = (
  name: string,
  benefits: string[],
  size: string,
  ingredients: string[] = [],
  extra: Partial<CatalogItem> = {}
): CatalogItem => ({ name, ingredients, benefits, size, use: "Underarm", ...extra });

const CATALOG: Catalog = {
  "Hair Masks": {
    desc: "3-in-1 hair masks for deep repair and nourishment, 750 ml tubs.",
    use: "Hair",
    items: [
      { name: "Silk Blossom Dry Hair Mask", ingredients: ["Rosehip Oil", "Hibiscus Extract", "Argan Oil"], benefits: ["3-in-1 repair for dry and damaged hair", "Shine boost", "0% parabens"], size: "750 ml", featured: true },
      { name: "Dusk Glow Reviving Hair Mask", ingredients: ["Vanilla", "Argan Oil", "Oat Milk"], benefits: ["Strengthens weak hair", "For lifeless, stressed and long hair"], size: "750 ml" },
      { name: "Tropic Hue Color-Treated Hair Mask", ingredients: ["Flaxseed", "Shea Butter", "Avocado"], benefits: ["Colour lock", "For dyed, Afro, coily and colour-treated hair"], size: "750 ml", featured: true },
      { name: "Verdant Calm Oily Hair Mask", ingredients: ["Aloe Vera", "Peppermint", "Green Tea"], benefits: ["Scalp balance", "For oily scalp, flat and greasy hair"], size: "750 ml" },
      { name: "Curl & Bounce Curly Hair Mask", ingredients: ["Cranberry", "Pomegranate", "Sunflower Seed Oil"], benefits: ["Curl definition", "For natural, curly, Afro and tight coily hair"], size: "750 ml", featured: true },
    ],
  },
  "Hijab Care": {
    desc: "Gentle, alcohol-free antiperspirants made for hijab days. 48H dry protection.",
    items: [
      rollOn("Hijab Fresh Antiperspirant", ["48H dry protection", "Alcohol-free", "Long-lasting fresh feel"], "50 ml", ["Niacinamide", "Sakura"], { featured: true }),
      rollOn("Hijab White Antiperspirant", ["48H dry protection", "Brightens and evens underarm tone", "Alcohol-free"], "50 ml", ["Glutathione", "Arbutin"]),
      rollOn("Hijab Dry Antiperspirant", ["48H dry protection", "Gentle comfort formula", "Alcohol-free"], "50 ml"),
    ],
  },
  "Men's Deodorants": {
    desc: "Sport and men's roll-ons for long-lasting dry protection.",
    items: [
      rollOn("Sport Active Roll-On", ["72H dry protection", "Energy boost freshness", "For active men"], "50 g"),
      rollOn("Sport Extra Dry Roll-On", ["72H dry protection", "Quick-dry, non-sticky", "0% alcohol"], "50 g", [], { featured: true }),
      rollOn("Cool Fresh Men Roll-On", ["48H protection", "Extra dry", "Cool fresh scent"], "50 ml"),
      rollOn("Fresh Protecia Men Roll-On", ["48H protection", "Invisible", "0% alcohol"], "50 ml"),
      rollOn("Active Fresh Roll-On", ["48H fresh", "Extra dry", "Antibacterial"], "50 g"),
    ],
  },
  "Roll-On Antiperspirants": {
    desc: "48H sweat and odour protection in everyday, alcohol-free and dry & fresh formulas.",
    items: [
      rollOn("Refreshing Roll-On", ["48H fresh", "0% alcohol", "Quick-dry"], "50 g"),
      rollOn("Whitening Roll-On", ["Brightens underarm tone", "0% alcohol", "48H protection"], "50 g", ["Vitamin C", "Vitamin E"]),
      rollOn("Brightening Lavender Roll-On", ["Brightening", "Calming lavender", "0% alcohol"], "50 g", ["Lavender"]),
      rollOn("Extra Bright Niacinamide Roll-On", ["Extra bright", "48H shield"], "50 g", ["Niacinamide"]),
      rollOn("Bright & Dry Roll-On", ["Bright and dry", "48H shield"], "50 g", ["Vitamin C"]),
      rollOn("Comfort & Dry Roll-On", ["Comfort and dry", "48H shield"], "50 g", ["Collagen"]),
      rollOn("Pearl & Beauty Roll-On", ["Pearl beauty", "0% alcohol", "48H protection"], "50 ml", ["Pearl"]),
      rollOn("Aloe Vera Roll-On", ["Soothing aloe vera", "0% alcohol", "48H protection"], "50 ml", ["Aloe Vera"]),
      rollOn("Extra Bright 0% Alcohol Roll-On", ["Extra bright", "0% alcohol", "48H protection"], "50 ml"),
      rollOn("Double Effect Roll-On", ["Dry + fresh", "48H protection"], "50 ml"),
      rollOn("Passion Charm Roll-On", ["Charming scent", "48H fresh"], "50 ml"),
      rollOn("Fresh Energy Roll-On", ["Fresh energy", "48H protection"], "50 ml"),
      rollOn("Extra Bright Dry & Fresh Roll-On", ["Extra bright", "Dry and fresh", "48H protection"], "50 ml"),
    ],
  },
  "Natural Care & Perfume Roll-Ons": {
    desc: "BILEF 5.5 natural care roll-ons (72H odour control) and Oriental Gems lasting perfume roll-ons.",
    items: [
      rollOn("5.5 Ceramide & Panthenol Roll-On", ["72H odour control", "Calming and repairing", "Alcohol-free"], "80 ml", ["Ceramide", "Panthenol"]),
      rollOn("5.5 Niacinamide & AHA Roll-On", ["72H odour control", "Brightening", "Alcohol-free"], "80 ml", ["Niacinamide", "AHA"], { featured: true }),
      rollOn("5.5 Aloe Vera & Avocado Oil Roll-On", ["72H odour control", "Soothing and hydrating", "Alcohol-free"], "80 ml", ["Aloe Vera", "Avocado Oil"]),
      rollOn("5.5 Rice & Arbutin Roll-On", ["72H odour control", "Gentle brightening", "Alcohol-free"], "80 ml", ["Rice", "Arbutin"]),
      rollOn("5.5 Vitamin C & Turmeric Roll-On", ["72H odour control", "Revitalising", "Alcohol-free"], "80 ml", ["Vitamin C", "Turmeric"]),
      rollOn("Pearl Bloom Perfume Roll-On", ["48H protection", "Floral perfume"], "50 g"),
      rollOn("Ocean Mirage Perfume Roll-On", ["48H protection", "Fresh aquatic scent"], "50 g"),
      rollOn("Amber Silk Perfume Roll-On", ["48H protection", "Warm amber fragrance"], "50 g"),
      rollOn("Oud Noir Perfume Roll-On", ["48H protection", "Rich oud perfume"], "50 g", [], { featured: true }),
    ],
  },
  "Deo Sticks & Body Sprays": {
    desc: "Non-staining 48H deo sticks and lightweight, fast-drying antiperspirant body sprays.",
    items: [
      rollOn("Cool Fresh Deo Stick", ["48H protection", "Refreshing cool scent", "Non-staining"], "40 g"),
      rollOn("Pure Invisible Deo Stick", ["48H protection", "Invisible protection", "Non-staining"], "40 g"),
      rollOn("Extra Bright Deo Stick", ["48H protection", "Brightening care", "Non-staining"], "40 g"),
      rollOn("Aloe Vera Deo Stick", ["48H protection", "Soothing aloe vera", "Non-staining"], "40 g", ["Aloe Vera"]),
      rollOn("Ice Cool Body Spray", ["Refreshing scent", "All-day freshness", "Fast-drying"], "80 g", [], { use: "Body" }),
      rollOn("Passion Charm Body Spray", ["Odour control", "Alluring fragrance", "Fast-drying"], "80 g", [], { use: "Body" }),
      rollOn("Fresh Blossom Body Spray", ["Delicate floral scent", "Gentle care", "Fast-drying"], "80 g", [], { use: "Body" }),
      rollOn("Aloe Vera Body Spray", ["Soothing and gentle", "Aloe-infused freshness", "Fast-drying"], "80 g", ["Aloe Vera"], { use: "Body" }),
    ],
  },
  "Face Care": {
    desc: "5-active cleansing mousses, multi-action serums and serum creams, including the Vitamin C+ brightening routine.",
    items: [
      { name: "Vitamin C Bright Radiance Cleansing Mousse", ingredients: ["Vitamin C"], benefits: ["Deep cleansing", "Bright radiance", "Built-in brush head"], size: "150 g", featured: true },
      { name: "Turmeric Calming Cleansing Mousse", ingredients: ["Turmeric"], benefits: ["Deep cleansing", "Calming balance"], size: "150 g" },
      { name: "Retinol Age Defense Cleansing Mousse", ingredients: ["Retinol"], benefits: ["Deep cleansing", "Age defence"], size: "150 g" },
      { name: "Tea Tree Purifying Cleansing Mousse", ingredients: ["Tea Tree"], benefits: ["Deep cleansing", "Purifying"], size: "150 g" },
      { name: "24-Karat Gold Cleansing Mousse", ingredients: ["24K Gold", "Hyaluronic Acid"], benefits: ["Gentle cleansing", "Long-acting moisture"], size: "150 g" },
      { name: "Vitamin C Skin Brightening Serum", ingredients: ["Vitamin C"], benefits: ["Fades dark spots", "Radiant glow", "Evens skin tone"], size: "30 g", featured: true },
      { name: "Turmeric Anti-Oxidation Serum", ingredients: ["Turmeric"], benefits: ["Reduces dullness", "Antioxidant"], size: "30 g" },
      { name: "Retinol Skin Renewal Serum", ingredients: ["Retinol"], benefits: ["Anti-ageing", "Skin renewal"], size: "30 g" },
      { name: "Tea Tree Skin Restoring Serum", ingredients: ["Tea Tree"], benefits: ["Calms breakouts", "Restores skin"], size: "30 g" },
      { name: "Collagen Rejuvenating Serum", ingredients: ["Collagen"], benefits: ["Plumps", "Firms"], size: "30 g" },
      { name: "Skin Brightening Eye Cream", ingredients: ["Vitamin C"], benefits: ["Brightens the eye area", "Glow"], size: "20 g", use: "Eye area" },
      { name: "Vitamin C AM SPF 50 Serum Cream", ingredients: ["Vitamin C"], benefits: ["SPF 50 daytime protection", "Brightening"], size: "50 g" },
      { name: "Vitamin C PM Serum Cream", ingredients: ["Vitamin C"], benefits: ["Renews skin overnight", "Brightening"], size: "50 g" },
      { name: "Saffron Glow Serum Cream", ingredients: ["Saffron"], benefits: ["Enhances radiance", "Anti-ageing"], size: "50 g" },
      { name: "Tea Tree Restoring Serum Cream", ingredients: ["Tea Tree"], benefits: ["Calms breakouts", "Purifies skin"], size: "50 g" },
    ],
  },
  "Body Wash & Gel Oils": {
    desc: "Floral essence body washes and 48-hour hydration body gel oils.",
    use: "Body",
    items: [
      { name: "Passion Embrace Body Wash", ingredients: ["Floral essence", "Natural essential oils"], benefits: ["Gentle cleansing", "Lasting floral scent"], size: "300 g / 1000 g" },
      { name: "Blossom Bliss Body Wash", ingredients: ["Floral essence", "Natural essential oils"], benefits: ["Gentle cleansing", "Lasting floral scent"], size: "300 g / 1000 g" },
      { name: "Midnight Charm Body Wash", ingredients: ["Floral essence", "Natural essential oils"], benefits: ["Gentle cleansing", "Lasting floral scent"], size: "300 g / 1000 g" },
      { name: "Golden Paradise Body Wash", ingredients: ["Floral essence", "Natural essential oils"], benefits: ["Gentle cleansing", "Lasting floral scent"], size: "300 g / 1000 g" },
      { name: "Vitamin C Body Gel Oil", ingredients: ["Vitamin C"], benefits: ["Brightens and boosts radiance", "48-hour hydration"], size: "200 ml", featured: true },
      { name: "Ceramide Body Gel Oil", ingredients: ["Ceramide"], benefits: ["Strengthens the skin barrier", "48-hour hydration"], size: "200 ml" },
      { name: "Papaya Body Gel Oil", ingredients: ["Papaya"], benefits: ["Enhances smoothness", "48-hour hydration"], size: "200 ml" },
      { name: "Aloe Vera Body Gel Oil", ingredients: ["Aloe Vera"], benefits: ["Calms irritated skin", "48-hour hydration"], size: "200 ml" },
      { name: "Coconut Body Gel Oil", ingredients: ["Coconut Oil"], benefits: ["Silky-soft finish", "48-hour hydration"], size: "200 ml" },
      { name: "Cocoa Body Gel Oil", ingredients: ["Cocoa"], benefits: ["Deeply nourishes", "48-hour hydration"], size: "200 ml" },
    ],
  },
  "Scrubs & Soaps": {
    desc: "Brightening body scrubs (exfoliate, revitalise, glow) and face & body bar soaps.",
    use: "Body",
    items: [
      { name: "Coffee Brighten Body Scrub", ingredients: ["Coffee"], benefits: ["Deep exfoliation", "Revitalising", "Brighter-looking skin"], size: "500 g" },
      { name: "Coconut Brighten Body Scrub", ingredients: ["Coconut"], benefits: ["Deep exfoliation", "Soft, glowing skin"], size: "500 g" },
      { name: "Vitamin C Brighten Body Scrub", ingredients: ["Vitamin C"], benefits: ["Deep exfoliation", "Radiant glow"], size: "500 g" },
      { name: "Tropical Brighten Body Scrub", ingredients: ["Strawberry", "Kiwi", "Papaya"], benefits: ["Deep exfoliation", "Mineral-rich scrub", "Vibrant glow"], size: "500 g", featured: true },
      { name: "Kojic Plus Face & Body Soap", ingredients: ["Kojic Acid"], benefits: ["Brightens and clears", "Deep cleansing", "Helps with acne"], size: "250 g", use: "Face and body" },
      { name: "Glutathione & Vitamin C Soap", ingredients: ["Glutathione", "Vitamin C", "Papaya", "Honey"], benefits: ["Targets dullness and uneven tone", "Natural actives"], size: "250 g", use: "Face and body" },
    ],
  },
};

export function importBilef() {
  return runClientImport({
    slugs: ["bilef"],
    brand: "BILEF",
    catalog: CATALOG,
    images: (slug) => [`${DIR}/${slug}.jpg`],
    tenant: {
      name: "BILEF",
      logoUrl: `${DIR}/logo.png`,
      showNameWithLogo: false,
      primaryColor: "#58733d",
      accentColor: "#e0763a",
      headingFont: "sans",
      tagline: "Experience the BILEF difference. Body care, deodorants, face care and hair masks for healthy, balanced skin.",
      heroEyebrow: "Body care brand",
      heroTitle: "Experience the BILEF difference.",
      heroSubtitle:
        "Antiperspirants, hair masks, face care, body washes and scrubs, formulated for real heat and humidity. Order for yourself, your shop or your salon.",
      heroImage: `${DIR}/hero.jpg`,
      aboutTitle: "True beauty is the confidence of healthy, balanced skin.",
      aboutIntro: "Lisa Li, Founder",
      about:
        "\"I believe that true care goes beyond the surface. It's about the quiet confidence that comes when your skin is truly healthy. If the process doesn't bring you joy, it isn't the care you deserve. It should be a ritual you look forward to every day.\" Lisa Li, Founder\n\n" +
        "BILEF is a body care brand from YASS Cosmetic. Four pillars guide everything it creates, from the ingredients it sources to the experiences it designs.",
      aboutImage: `${DIR}/about.jpg`,
      stats: [
        { value: "74", label: "Products available" },
        { value: "9", label: "Product ranges" },
        { value: "48–72H", label: "Deodorant protection" },
        { value: "B2B & Retail", label: "Service model" },
      ],
      highlights: [
        { title: "Science first", desc: "Formulas developed with Hong Kong university labs and tested for results." },
        { title: "Crafted in-house", desc: "BILEF runs its own production, with full traceability on every step." },
        { title: "Climate-ready", desc: "Built to stay effective in intense sun and heat." },
        { title: "Joyful rituals", desc: "Textures that melt into skin and make daily care a pleasure." },
      ],
      audiences: ["Supermarkets & beauty shops", "Pharmacies", "Salons & spas", "Online sellers", "Gyms & sports stores", "Distributors"],
      faqs: [
        {
          q: "How do I get prices?",
          a: "Send an enquiry from any product page or message us on WhatsApp with the products and quantities you need. We'll reply with pricing and delivery options.",
        },
        {
          q: "Can I buy wholesale for my shop?",
          a: "Yes. We supply supermarkets, beauty shops, pharmacies, salons and online sellers. Apply on the Become a Distributor page or send us a message.",
        },
        {
          q: "Are the deodorants alcohol-free?",
          a: "The Hijab Care, 5.5 Natural Care and 0% Alcohol series are alcohol-free, as are several other roll-ons. Each product page lists its key features.",
        },
      ],
      distributorIntro:
        "Stock BILEF in your shop, salon or online store. Deodorants and body care sell every week, and we support distributors with wholesale pricing and product photos.",
      distributorBenefits: [
        { title: "Wholesale pricing", desc: "Better margins on bulk orders." },
        { title: "Fast-moving range", desc: "Deodorants, body washes and hair masks customers buy again and again." },
        { title: "Marketing support", desc: "Product photos and banners for your shop and social media." },
      ],
      footerBlurb: "BILEF body care by YASS Cosmetic. Experience the BILEF difference.",
      currency: "NGN",
      showPrices: false,
      enableDistributors: true,
      metaTitle: "BILEF: Deodorants, Body Care, Face Care & Hair Masks",
      metaDescription:
        "Shop BILEF antiperspirant roll-ons, hijab care deodorants, 3-in-1 hair masks, vitamin C face care, body gel oils and scrubs. Retail and wholesale.",
    },
  });
}
