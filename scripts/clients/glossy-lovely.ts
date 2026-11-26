/**
 * Creates or updates the Glossy & Lovely client (Green Chemicals Pakistan).
 *   npm run client:glossy-lovely
 */
import { importGlossyLovely } from "../../src/lib/clientImports/glossyLovely";

importGlossyLovely()
  .then((r) => {
    console.log(`✓ Glossy & Lovely client with ${r.products} products in ${r.categories} categories`);
    if (r.missingPhotos) console.log(`  ${r.missingPhotos} products have no photo yet`);
    console.log("  Preview: http://glossy-lovely.localhost:3000 or /?client=glossy-lovely");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
