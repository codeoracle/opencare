/**
 * Creates or updates the RAFCARE client from the AFCARE Ready Stock Catalog.
 *   npm run client:rafcare
 * The import itself lives in src/lib/clientImports/rafcare.ts.
 */
import { importRafcare } from "../../src/lib/clientImports/rafcare";

importRafcare()
  .then((r) => {
    console.log(`✓ RAFCARE client with ${r.products} products in ${r.categories} categories`);
    if (r.missingPhotos) console.log(`  ${r.missingPhotos} products have no photo yet`);
    console.log("  Preview: http://rafcare.localhost:3000 or /?client=rafcare");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
