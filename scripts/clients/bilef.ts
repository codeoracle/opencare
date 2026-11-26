/**
 * Creates or updates the BILEF client (YASS Cosmetic).
 *   npm run client:bilef
 */
import { importBilef } from "../../src/lib/clientImports/bilef";

importBilef()
  .then((r) => {
    console.log(`✓ BILEF client with ${r.products} products in ${r.categories} categories`);
    if (r.missingPhotos) console.log(`  ${r.missingPhotos} products have no photo yet`);
    console.log("  Preview: http://bilef.localhost:3000 or /bilef");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
