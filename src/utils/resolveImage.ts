/**
 * Utility to resolve local and dynamic image assets in Vite.
 * In production builds (e.g. Render, Vercel, Netlify), static paths like
 * "/src/assets/images/..." do not exist in the output directory.
 * Vite hashes and bundles all assets into "/assets/...".
 *
 * Using `import.meta.glob` ensures Vite bundles all images and provides
 * their production hashed URLs.
 */

const imageModules = import.meta.glob<{ default: string }>(
  '../assets/images/**/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG}',
  { eager: true }
);

// Map to hold lookup variants for fast O(1) resolution
const imageMap = new Map<string, string>();

Object.entries(imageModules).forEach(([path, mod]) => {
  const resolvedUrl = typeof mod === 'string' ? mod : mod?.default;
  if (!resolvedUrl) return;

  // 1. Exact relative glob path (e.g. "../assets/images/product.jpg")
  imageMap.set(path, resolvedUrl);

  // 2. Filename only (e.g. "product.jpg")
  const fileName = path.split('/').pop();
  if (fileName) {
    imageMap.set(fileName, resolvedUrl);
    imageMap.set(fileName.toLowerCase(), resolvedUrl);

    // 3. Absolute and relative variations commonly used in code & databases:
    imageMap.set(`/src/assets/images/${fileName}`, resolvedUrl);
    imageMap.set(`src/assets/images/${fileName}`, resolvedUrl);
    imageMap.set(`./images/${fileName}`, resolvedUrl);
    imageMap.set(`/images/${fileName}`, resolvedUrl);
    imageMap.set(`images/${fileName}`, resolvedUrl);
    imageMap.set(`/assets/images/${fileName}`, resolvedUrl);
  }
});

/**
 * Resolves any image path, filename, or URL to the correct Vite production asset URL.
 * If the path is an external URL (http/https/data/blob), it returns it unchanged.
 */
export function resolveImage(rawPath?: string | null): string {
  if (!rawPath || typeof rawPath !== 'string') return '';

  const trimmed = rawPath.trim();
  if (!trimmed) return '';

  // Return external or data URLs as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Exact match
  if (imageMap.has(trimmed)) {
    return imageMap.get(trimmed)!;
  }

  // Lowercase match
  const lower = trimmed.toLowerCase();
  if (imageMap.has(lower)) {
    return imageMap.get(lower)!;
  }

  // Extract clean filename without path and query params
  const cleanFileName = trimmed.split('/').pop()?.split('?')[0];
  if (cleanFileName) {
    if (imageMap.has(cleanFileName)) {
      return imageMap.get(cleanFileName)!;
    }
    const cleanLower = cleanFileName.toLowerCase();
    if (imageMap.has(cleanLower)) {
      return imageMap.get(cleanLower)!;
    }
  }

  // Fallback to original path if not found in bundled map
  return trimmed;
}

/**
 * Resolves an array of image paths
 */
export function resolveImages(paths?: (string | null | undefined)[] | null): string[] {
  if (!paths || !Array.isArray(paths)) return [];
  return paths.map(p => resolveImage(p)).filter(Boolean);
}

export default resolveImage;
