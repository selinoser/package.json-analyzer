export function parsePackage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }

    if (file.name !== 'package.json') {
      reject(new Error('Only package.json files are accepted.'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result)

        if (typeof content !== 'object' || content === null) {
          reject(new Error('Invalid package.json: not a JSON object'))
          return
        }

        resolve({
          name: content.name || 'Unknown',
          version: content.version || '0.0.0',
          description: content.description || '',
          author: content.author || '',
          license: content.license || '',
          private: content.private || false,
          engines: content.engines || {},
          scripts: content.scripts || {},
          dependencies: content.dependencies || {},
          devDependencies: content.devDependencies || {},
          peerDependencies: content.peerDependencies || {},
          raw: content,
        })
      } catch {
        reject(new Error('Failed to parse JSON — make sure the file is valid'))
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
