import { CreateNodeArgs } from 'gatsby';
import * as path from 'path';
import * as fs from 'fs';
import { PluginOptionsType } from './pluginOptions';

const DEPLOY_DIR = path.join(process.cwd(), `public`);

function isSupported(filePath: string, options: PluginOptionsType): boolean {
  const basename = path.basename(filePath);
  if (basename.startsWith('.')) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  if (
    (options.staticFile.includeExtensions.length === 0 ||
      options.staticFile.includeExtensions.find((x) => x === ext)) &&
    !options.staticFile.excludeExtensions.find((x) => x === ext)
  ) {
    return true;
  }
  return false;
}

export async function copyStaticFiles(
  { node }: CreateNodeArgs,
  options: PluginOptionsType,
): Promise<void> {
  const filePath = node.absolutePath as string;
  if (!isSupported(filePath, options)) {
    return;
  }

  const newFilePath = path.join(DEPLOY_DIR, node.relativePath as string);
  const dstDir = path.dirname(newFilePath);
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }
  await fs.copyFile(filePath, newFilePath, (err) => {
    if (err) {
      throw err;
    }
  });
}
