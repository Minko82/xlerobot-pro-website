import { promises as fs } from "node:fs";
import path from "node:path";

function normalizeBase(input) {
  if (!input) return "/";
  let base = input.trim();
  if (!base.startsWith("/")) base = `/${base}`;
  if (base.length > 1 && base.endsWith("/")) base = base.slice(0, -1);
  return base || "/";
}

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(fullPath)));
    } else if (entry.isFile() && fullPath.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function detectBaseFromDist(distDir) {
  try {
    const indexPath = path.join(distDir, "index.html");
    const html = await fs.readFile(indexPath, "utf8");

    const sitemapMatch = html.match(
      /<link[^>]*rel=["']sitemap["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    );
    if (sitemapMatch) {
      const href = sitemapMatch[1];
      const stripped = href.replace(/\/?sitemap-index\.xml$/, "");
      return normalizeBase(stripped || "/");
    }
  } catch {
    // Fall through to default.
  }

  return "/";
}

function prefixRootLinks(html, basePath) {
  if (basePath === "/") return html;

  const baseNoSlash = basePath.slice(1);
  const pattern = /(href|src)=("|\')\/([^"']*)\2/g;

  return html.replace(pattern, (match, attr, quote, rawPath) => {
    // Ignore protocol-relative URLs like //example.com.
    if (rawPath.startsWith("/")) return match;

    // Already prefixed with base path.
    if (rawPath === baseNoSlash || rawPath.startsWith(`${baseNoSlash}/`))
      return match;

    const prefixed = rawPath ? `${basePath}/${rawPath}` : `${basePath}/`;
    return `${attr}=${quote}${prefixed}${quote}`;
  });
}

async function main() {
  const distDir = process.argv[2] || "dist";
  const envBase =
    process.env.SITE_BASE_PATH || process.env.BASE_PATH || process.env.BASE_URL;
  const basePath = normalizeBase(
    envBase || (await detectBaseFromDist(distDir)),
  );

  const htmlFiles = await listHtmlFiles(distDir);
  let changed = 0;

  for (const file of htmlFiles) {
    const original = await fs.readFile(file, "utf8");
    const updated = prefixRootLinks(original, basePath);
    if (updated !== original) {
      await fs.writeFile(file, updated);
      changed += 1;
    }
  }

  console.log(
    `[prefix-base-links] base=${basePath} scanned=${htmlFiles.length} changed=${changed}`,
  );
}

main().catch((error) => {
  console.error("[prefix-base-links] failed:", error);
  process.exitCode = 1;
});
