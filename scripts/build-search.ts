import fs from 'fs';
import jsonminify from 'jsonminify';
import path from 'path';
import { getSearchData } from '../lib/posts';

async function main() {
  const result = await getSearchData();

  // Create out directory if it doesn't exist
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Save to search.json with maximum compression
  const outputPath = path.join(outDir, 'search.json');
  const jsonString = JSON.stringify(result);
  const minifiedJson = jsonminify(jsonString);
  fs.writeFileSync(outputPath, minifiedJson);

  // Calculate and log size difference
  const originalSize = Buffer.byteLength(JSON.stringify(result, null, 2));
  const compressedSize = Buffer.byteLength(minifiedJson);
  const compressionRatio = Math.round(
    ((originalSize - compressedSize) / originalSize) * 100,
  );

  console.log(`Search data saved to ${outputPath}`);
  console.log(
    `Size optimized: ${originalSize} bytes -> ${compressedSize} bytes (${compressionRatio}% reduction)`,
  );
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
