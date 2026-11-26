/**
 * Creates or updates the V.V.LOVE client.
 *   npm run client:vv-love
 */
import { importVvLove } from "../../src/lib/clientImports/vvLove";

importVvLove()
  .then((r) => {
    console.log(`✓ V.V.LOVE client with ${r.products} products in ${r.categories} categories`);
    if (r.missingPhotos) console.log(`  ${r.missingPhotos} products have no photo yet`);
    console.log("  Preview: /vv-love");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
