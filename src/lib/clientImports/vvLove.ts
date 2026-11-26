/**
 * V.V.LOVE — fragrance and body mist brand. Built from three catalogues:
 * "VL Shower Gel Set of 3", "VL Water Bottle Collection Spray" and "VL90ml Mist".
 * Photos are cropped from the catalogue cards: public/clients/vv-love/<item no>.jpg.
 *
 * The catalogues list each scent as "Inspired by <famous brand>". Those brand
 * names are deliberately NOT used on the site: naming other companies'
 * trademarks to sell look-alike scents invites takedowns and legal claims.
 * Products use their own V.V.LOVE names; item numbers are kept as SKUs.
 */
import { runClientImport, type Catalog, type CatalogItem } from "@/lib/clientImports/runner";
import { createSlug } from "@/lib/utils";

const DIR = "/clients/vv-love";

/** Product slug → catalogue item number (also the photo file name). */
const CODE: Record<string, string> = {};

function p(code: string, name: string, benefits: string[], extra: Partial<CatalogItem> = {}): CatalogItem {
  CODE[createSlug(name)] = code.toLowerCase();
  return {
    name,
    ingredients: [],
    benefits,
    note: `Item no. ${code}.`,
    ...extra,
  };
}

const SET = ["Shower gel + body mist + body lotion", "Gift-ready packaging", "12 sets per carton"];
const SET_BAG = ["Shower gel + body mist + body lotion", "Reusable gift tote", "12 sets per carton"];
const BOTTLE = ["Refillable water-bottle style mist", "Carry strap and bag hook", "250 ml, 150 ml and 90 ml"];
const MIST = ["Fine, long-lasting body mist", "Pocket size"];
const HAIR_BODY = ["Hair & body mist", "Shimmering, lightweight finish"];
const ASSORT = ["4 designs per assortment", "144 pieces per carton", "Ideal for retail shelves"];
const DISPLAY = ["Counter display box", "240 pieces per carton", "Ready for the shop counter"];

const CATALOG: Catalog = {
  "Bath & Body Gift Sets": {
    desc: "Three-piece sets of shower gel, body mist and body lotion in matching scents, gift boxed.",
    use: "Body",
    items: [
      p("VL9062-11", "Purple Rose Gift Set", SET, { featured: true }),
      p("VL9062-12", "Cherry Blossom Gift Set", SET),
      p("VL9062-13", "Dream Summer Gift Set", SET),
      p("VL9062-14", "Shining Love Gift Set", SET),
      p("VL9062-15", "Night Lure Gift Set", SET),
      p("VL9062-16", "Posy Sparkles Gift Set", SET),
      p("VL9062-17", "Pink Lace Gift Set", SET),
      p("VL9062-18", "Choc Stops Gift Bag", SET_BAG, { featured: true, note: "Item no. VL9062-18. Chocolate-scented set." }),
      p("VL9062-19", "Soufflé Gift Bag", SET_BAG, { note: "Item no. VL9062-19. Strawberry cake-scented set." }),
      p("VL9062-20", "Dulce Heist Gift Bag", SET_BAG, { note: "Item no. VL9062-20. Pineapple cocktail-scented set." }),
      p("VL9062-21", "Scoop Heist Gift Bag", SET_BAG, { note: "Item no. VL9062-21. Strawberry ice cream-scented set." }),
    ],
  },
  "Water Bottle Body Mists": {
    desc: "Peach Nectar body mist in a playful water-bottle design, in six colours and three sizes.",
    use: "Body",
    items: [
      p("VL9053-C1", "Water Bottle Mist Ruby", BOTTLE, { note: "Item nos. VL9053-C1 / VL9052-D1 / VL9058-111." }),
      p("VL9053-C2", "Water Bottle Mist Sunshine", BOTTLE, { featured: true, note: "Item nos. VL9053-C2 / VL9052-D2 / VL9058-120." }),
      p("VL9053-C3", "Water Bottle Mist Blush", BOTTLE, { note: "Item nos. VL9053-C3 / VL9052-D3 / VL9058-121." }),
      p("VL9053-C4", "Water Bottle Mist Aqua", BOTTLE, { note: "Item nos. VL9053-C4 / VL9052-D4 / VL9058-122." }),
      p("VL9053-C5", "Water Bottle Mist Lavender", BOTTLE, { note: "Item nos. VL9053-C5 / VL9052-D5 / VL9058-123." }),
      p("VL9053-C6", "Water Bottle Mist Coral", BOTTLE, { note: "Item nos. VL9053-C6 / VL9052-D6 / VL9058-124." }),
    ],
  },
  "Body Mists 90 ml": {
    desc: "Pocket-size 90 ml body mists in signature V.V.LOVE bottles.",
    use: "Body",
    items: [
      p("VL9058-112", "Intellectual Life 06 Body Mist", MIST, { size: "90 ml", featured: true }),
      p("VL9058-113", "Intellectual Life 02 Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-114", "Intellectual Life 04 Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-115", "Intellectual Life 07 Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-116", "Always Late Body Mist Pink", MIST, { size: "90 ml" }),
      p("VL9058-117", "Always Late Body Mist Blue", MIST, { size: "90 ml" }),
      p("VL9058-118", "Always Late Body Mist Orange", MIST, { size: "90 ml" }),
      p("VL9058-119", "Always Late Body Mist Mint", MIST, { size: "90 ml" }),
      p("VL9058-125", "Cherry Delight Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-126", "Blooming Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-127", "A Lovely Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-128", "Floral Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-129", "Black Intense Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-130", "Intense Violet Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-131", "Intense Blue Body Mist", MIST, { size: "90 ml" }),
      p("VL9058-132", "Intense Lime Body Mist", MIST, { size: "90 ml" }),
      p("VL9052-21", "Blooming Rose Body Mist", MIST, { size: "55 ml" }),
      p("VL9052-22", "Litchi Veil Body Mist", MIST, { size: "55 ml" }),
      p("VL9052-23", "Charming Vanilla Pump Mist", MIST, { size: "55 ml" }),
      p("VL9052-24", "Lavender Chill Body Mist", MIST, { size: "55 ml" }),
      p("VL9052-25", "Vanished Memory Body Mist", MIST, { size: "55 ml" }),
      p("VL9052-26", "Ginger Pace Body Mist", MIST, { size: "55 ml" }),
      p("VL9052-27", "Tropical Kiss Body Mist", MIST, { size: "55 ml" }),
      p("VL9052-28", "Vanilla Veil Body Mist", MIST, { size: "55 ml" }),
    ],
  },
  "Hair & Body Mists": {
    desc: "Shimmering hair and body mists in rounded glass-look bottles.",
    use: "Hair and body",
    items: [
      p("VL99081-1", "Missing Person Hair & Body Mist", HAIR_BODY),
      p("VL99081-2", "Charming Vanilla Hair & Body Mist", HAIR_BODY, { featured: true }),
      p("VL99081-3", "Charming Berry Hair & Body Mist", HAIR_BODY),
      p("VL99081-4", "Silent Whisper Hair & Body Mist", HAIR_BODY),
      p("VL99081-5", "Mossy Dream Hair & Body Mist", HAIR_BODY),
      p("VL99081-6", "Fuego Vanilla Hair & Body Mist", HAIR_BODY),
      p("VL99081-7", "Pistachio Gelato Hair & Body Mist", HAIR_BODY),
      p("VL99081-8", "Cloudy Candy Hair & Body Mist", HAIR_BODY),
      p("VL99081-9", "Juice Apple Hair & Body Mist", HAIR_BODY),
      p("VL99081-10", "Hello Kiss Hair & Body Mist", HAIR_BODY),
      p("VL99081-11", "Cherry Fizz Hair & Body Mist", HAIR_BODY),
      p("VL99081-12", "Vanilla Fluff Hair & Body Mist", HAIR_BODY),
    ],
  },
  "Wholesale Mist Assortments": {
    desc: "Mixed-design body mist assortments and counter displays for shops, sold by the carton.",
    use: "Body",
    items: [
      ...["59", "60", "61", "62", "63", "73", "74", "75", "76", "77", "78", "79", "80", "81", "83", "84", "85", "86", "146", "147", "148", "149", "150", "151", "152", "153", "154"].map(
        (n) => p(`VL9058-${n}`, `Body Mist Assortment VL9058-${n}`, ASSORT)
      ),
      ...["68", "69", "70", "71", "72", "82"].map((n) =>
        p(`VL9058-${n}`, `Mini Mist Counter Display VL9058-${n}`, DISPLAY)
      ),
      p("VL9058-157", "Fruit Mush Mist Assortment VL9058-157", ["4 fruit designs with charms", "Ideal for retail shelves"]),
      p("VL9058-158", "Fruit Mush Mist Assortment VL9058-158", ["4 fruit designs with charms", "Ideal for retail shelves"]),
      p("VL9901-H1", "Fruit Mush Mist Assortment VL9901-H1", ["4 fruit designs with charms", "Ideal for retail shelves"]),
      p("VL9901-H2", "Fruit Mush Mist Assortment VL9901-H2", ["4 fruit designs with charms", "Ideal for retail shelves"]),
    ],
  },
  "Body Mist Gift Sets": {
    desc: "Boxed sets of four body mists, perfect for gifting.",
    use: "Body",
    items: [
      p("VL9058-34", "Body Mist Gift Set of 4 (Pink Stripe)", ["4 body mists", "Gift box", "24 sets per carton"]),
      p("VL9058-35", "Body Mist Gift Set of 4 (Glitter)", ["4 body mists", "Gift box", "24 sets per carton"]),
      p("VL9058-36", "Body Mist Gift Set of 4 (Starlight)", ["4 body mists", "Gift box", "24 sets per carton"]),
    ],
  },
};

export function importVvLove() {
  return runClientImport({
    slugs: ["vv-love"],
    brand: "V.V.LOVE",
    catalog: CATALOG,
    images: (slug) => (CODE[slug] ? [`${DIR}/${CODE[slug]}.jpg`] : []),
    tenant: {
      name: "V.V.LOVE",
      logoUrl: `${DIR}/logo.png`,
      showNameWithLogo: false,
      primaryColor: "#5b2a55",
      accentColor: "#d4568f",
      headingFont: "serif",
      tagline: "Body mists, hair & body mists and bath gift sets in playful, long-lasting scents.",
      heroEyebrow: "Fragrance & body mists",
      heroTitle: "Scents you'll want to wear every day.",
      heroSubtitle:
        "V.V.LOVE body mists, hair & body mists and three-piece bath gift sets. Shop single bottles, or stock your store with ready-made assortments and counter displays.",
      heroImage: `${DIR}/hero.jpg`,
      aboutTitle: "About V.V.LOVE",
      aboutIntro: "Playful fragrance for every day and every gift.",
      about:
        "V.V.LOVE makes affordable, long-lasting fragrances: body mists in signature bottles, shimmering hair & body mists and three-piece bath gift sets.\n\n" +
        "New collections arrive throughout the year, from pocket-size 90 ml mists and refillable water-bottle sprays to gourmand gift bags with chocolate, cake, cocktail and ice-cream scents.",
      aboutImage: `${DIR}/about.jpg`,
      stats: [
        { value: "93", label: "Products available" },
        { value: "6", label: "Collections" },
        { value: "90 ml", label: "Pocket-size mists" },
        { value: "B2B & Retail", label: "Service model" },
      ],
      highlights: [
        { title: "Gift-ready", desc: "Boxed sets and gift bags for birthdays, holidays and Valentine's." },
        { title: "Shelf-ready assortments", desc: "Mixed-design cartons and counter displays that sell from day one." },
        { title: "Trend-led scents", desc: "Sweet, fruity, floral and gourmand fragrances people ask for." },
      ],
      audiences: ["Gift shops", "Supermarkets & beauty stores", "Boutiques", "Online sellers", "Event & souvenir buyers", "Distributors"],
      faqs: [
        {
          q: "How do I get prices?",
          a: "Send an enquiry from any product page or message us on WhatsApp with the item numbers and quantities you need.",
        },
        {
          q: "Can I buy by the carton?",
          a: "Yes. Assortments come 144 pieces per carton, counter displays 240 pieces and gift sets 12 or 24 per carton.",
        },
      ],
      distributorIntro:
        "Stock V.V.LOVE in your shop or online store. Body mists and gift sets are fast-moving, impulse-buy products with strong margins.",
      distributorBenefits: [
        { title: "Wholesale pricing", desc: "Better margins on carton orders." },
        { title: "Ready-made assortments", desc: "Mixed designs and counter displays, no sorting needed." },
        { title: "Seasonal gift sets", desc: "Products that sell fast around holidays." },
      ],
      footerBlurb: "V.V.LOVE body mists and fragrance gift sets.",
      currency: "NGN",
      showPrices: false,
      enableDistributors: true,
      metaTitle: "V.V.LOVE: Body Mists, Hair & Body Mists and Gift Sets",
      metaDescription:
        "Shop V.V.LOVE body mists, shimmering hair & body mists, water-bottle sprays and bath gift sets. Retail, wholesale cartons and counter displays.",
    },
  });
}
