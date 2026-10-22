const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const sharp = require('sharp')

const root = path.resolve(__dirname, '..')
const uploadRoot = path.join(root, 'public/uploads')
const apply = process.argv.includes('--apply')
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function parseChunks(buffer) {
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error('Invalid PNG signature')
  const chunks = []
  let offset = 8
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const end = offset + 12 + length
    if (end > buffer.length) throw new Error('Truncated PNG chunk')
    chunks.push({ type: buffer.toString('ascii', offset + 4, offset + 8), raw: buffer.subarray(offset, end) })
    offset = end
    if (chunks.at(-1).type === 'IEND') break
  }
  if (offset !== buffer.length || chunks[0]?.type !== 'IHDR' || chunks.at(-1)?.type !== 'IEND') {
    throw new Error('Invalid PNG chunk sequence')
  }
  return chunks
}

function sha(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function rebuildPng(originalChunks, optimizedChunks) {
  const idats = optimizedChunks.filter(chunk => chunk.type === 'IDAT')
  if (!idats.length) throw new Error('Optimized PNG has no IDAT chunks')
  const result = [signature]
  let inserted = false
  for (const chunk of originalChunks) {
    if (chunk.type === 'IDAT') {
      if (!inserted) {
        result.push(...idats.map(item => item.raw))
        inserted = true
      }
    } else result.push(chunk.raw)
  }
  return Buffer.concat(result)
}

async function scan(filePath) {
  const original = fs.readFileSync(filePath)
  const stat = fs.statSync(filePath)
  if (stat.size < 50_000) return null
  const originalChunks = parseChunks(original)
  const sourceMetadata = originalChunks.filter(chunk => chunk.type !== 'IDAT').map(chunk => chunk.raw)
  const encoded = await sharp(original)
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10, palette: false })
    .keepMetadata()
    .toBuffer()
  const optimizedChunks = parseChunks(encoded)
  const optimized = rebuildPng(originalChunks, optimizedChunks)
  const optimizedMetadata = parseChunks(optimized).filter(chunk => chunk.type !== 'IDAT').map(chunk => chunk.raw)
  if (sourceMetadata.length !== optimizedMetadata.length || !sourceMetadata.every((chunk, i) => chunk.equals(optimizedMetadata[i]))) {
    throw new Error('PNG metadata chunk changed')
  }
  const [originalMeta, optimizedMeta, originalPixels, optimizedPixels] = await Promise.all([
    sharp(original).metadata(), sharp(optimized).metadata(), sharp(original).raw().toBuffer(), sharp(optimized).raw().toBuffer(),
  ])
  if (originalMeta.width !== optimizedMeta.width || originalMeta.height !== optimizedMeta.height || !originalPixels.equals(optimizedPixels)) {
    throw new Error('Decoded pixels or dimensions changed')
  }
  const saving = original.length - optimized.length
  if (saving < 1_024 || saving / original.length < 0.01) return null
  return {
    path: path.relative(root, filePath),
    original,
    optimized,
    originalSha256: sha(original),
    optimizedSha256: sha(optimized),
    rawSha256: sha(originalPixels),
    bytesBefore: original.length,
    bytesAfter: optimized.length,
    width: originalMeta.width,
    height: originalMeta.height,
    mode: stat.mode & 0o777,
  }
}

async function main() {
  const files = walk(uploadRoot).filter(file => file.toLowerCase().endsWith('.png')).sort()
  const candidates = []
  const skipped = []
  for (const file of files) {
    try {
      const candidate = await scan(file)
      if (candidate) candidates.push(candidate)
    } catch (error) {
      skipped.push({ path: path.relative(root, file), reason: String(error) })
    }
  }
  const bytesBefore = candidates.reduce((n, item) => n + item.bytesBefore, 0)
  const bytesAfter = candidates.reduce((n, item) => n + item.bytesAfter, 0)
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', pngFiles: files.length, candidates: candidates.length, bytesBefore, bytesAfter, bytesSaved: bytesBefore - bytesAfter, skipped }, null, 2))
  if (!apply || !candidates.length) return

  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const backupDir = path.join(root, 'backups', `png-lossless-${stamp}`)
  fs.mkdirSync(backupDir, { recursive: true })
  const manifest = candidates.map(({ path: relativePath, originalSha256, optimizedSha256, rawSha256, bytesBefore: before, bytesAfter: after, width, height, mode }) => ({ path: relativePath, originalSha256, optimizedSha256, rawSha256, bytesBefore: before, bytesAfter: after, width, height, mode }))
  for (const item of candidates) {
    const savedPath = path.join(backupDir, item.path)
    fs.mkdirSync(path.dirname(savedPath), { recursive: true })
    fs.writeFileSync(savedPath, item.original, { flag: 'wx' })
    if (sha(fs.readFileSync(savedPath)) !== item.originalSha256) throw new Error(`Backup verification failed: ${item.path}`)
  }
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

  const changed = []
  try {
    for (const item of candidates) {
      const filePath = path.join(root, item.path)
      if (sha(fs.readFileSync(filePath)) !== item.originalSha256) throw new Error(`Source changed since preview: ${item.path}`)
      const tempPath = `${filePath}.lossless-${process.pid}.tmp`
      fs.writeFileSync(tempPath, item.optimized, { mode: item.mode, flag: 'wx' })
      fs.chmodSync(tempPath, item.mode)
      fs.renameSync(tempPath, filePath)
      changed.push(item)
      if (sha(fs.readFileSync(filePath)) !== item.optimizedSha256) throw new Error(`Write verification failed: ${item.path}`)
    }
  } catch (error) {
    for (const item of changed.reverse()) {
      const filePath = path.join(root, item.path)
      fs.copyFileSync(path.join(backupDir, item.path), filePath)
      fs.chmodSync(filePath, item.mode)
    }
    throw error
  }
  console.log(JSON.stringify({ backup: path.relative(root, backupDir), optimized: changed.length, verifiedPixelIdentical: changed.length, bytesSaved: bytesBefore - bytesAfter }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
