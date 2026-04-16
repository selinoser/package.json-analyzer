const NPM_REGISTRY = 'https://registry.npmjs.org'
const CACHE = new Map()

function buildNpmUrl(name) {
  // Scoped packages: @scope/pkg → /@scope%2Fpkg/latest
  // Regular packages: pkg → /pkg/latest
  if (name.startsWith('@')) {
    const encoded = name.replace('/', '%2F')
    return `${NPM_REGISTRY}/${encoded}/latest`
  }
  return `${NPM_REGISTRY}/${name}/latest`
}

async function fetchPackageVersion(name) {
  if (CACHE.has(name)) return CACHE.get(name)

  try {
    const res = await fetch(buildNpmUrl(name), {
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const result = {
      latest: data.version || null,
      description: data.description || '',
      homepage: data.homepage || '',
      license: data.license || '',
    }

    CACHE.set(name, result)
    return result
  } catch {
    const fallback = { latest: null, description: '', homepage: '', license: '' }
    CACHE.set(name, fallback)
    return fallback
  }
}

export async function fetchAllVersions(packageNames) {
  // Batch requests with concurrency limit to avoid rate limiting
  const CONCURRENCY = 8
  const results = {}

  for (let i = 0; i < packageNames.length; i += CONCURRENCY) {
    const batch = packageNames.slice(i, i + CONCURRENCY)
    const settled = await Promise.allSettled(
      batch.map((name) =>
        fetchPackageVersion(name).then((data) => ({ name, data }))
      )
    )

    for (const result of settled) {
      if (result.status === 'fulfilled') {
        results[result.value.name] = result.value.data
      }
    }
  }

  return results
}
