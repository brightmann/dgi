import { getSearchData } from '../lib/posts';
import fs from 'fs';
import path from 'path';

async function main() {
  const result = await getSearchData();

  // Create out directory if it doesn't exist
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Save to search.json
  const outputPath = path.join(outDir, 'search.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(`Search data saved to ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
