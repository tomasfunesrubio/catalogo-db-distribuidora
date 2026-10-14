// GITHUB_PAGES=true builds a static site under /catalogo-db-distribuidora (see scripts/deploy-pages.sh)
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const basePath = isGithubPages ? '/catalogo-db-distribuidora' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isGithubPages && { output: 'export', trailingSlash: true }),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
