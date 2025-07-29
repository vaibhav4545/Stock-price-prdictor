#!/usr/bin/env node

import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

const DIST_DIR = 'dist'
const MAX_BUNDLE_SIZE = 1024 * 1024 // 1MB
const MAX_CHUNK_SIZE = 500 * 1024 // 500KB

async function analyzeBuild() {
  console.log('🔍 Analyzing build performance...\n')

  try {
    // Check if dist directory exists
    await fs.access(DIST_DIR)
  } catch {
    console.error('❌ Build directory not found. Run `npm run build` first.')
    process.exit(1)
  }

  const files = await fs.readdir(DIST_DIR, { recursive: true })
  const jsFiles = files.filter(file => file.endsWith('.js') && !file.includes('node_modules'))
  
  let totalSize = 0
  const fileAnalysis = []

  for (const file of jsFiles) {
    const filePath = path.join(DIST_DIR, file)
    const stats = await fs.stat(filePath)
    const sizeKB = Math.round(stats.size / 1024)
    
    totalSize += stats.size
    fileAnalysis.push({
      file,
      size: stats.size,
      sizeKB,
      type: getFileType(file)
    })
  }

  // Sort by size
  fileAnalysis.sort((a, b) => b.size - a.size)

  console.log('📊 Bundle Analysis Results:')
  console.log('=' .repeat(50))
  
  fileAnalysis.forEach(({ file, sizeKB, type }) => {
    const emoji = getEmoji(type)
    const status = sizeKB > MAX_CHUNK_SIZE / 1024 ? '⚠️ ' : '✅ '
    console.log(`${status}${emoji} ${file}: ${sizeKB}KB`)
  })

  console.log('\n📈 Summary:')
  console.log(`Total bundle size: ${Math.round(totalSize / 1024)}KB`)
  
  if (totalSize > MAX_BUNDLE_SIZE) {
    console.log('⚠️  Bundle size exceeds 1MB. Consider:')
    console.log('  - Code splitting')
    console.log('  - Lazy loading components')
    console.log('  - Tree shaking unused imports')
    console.log('  - Optimizing dependencies')
  } else {
    console.log('✅ Bundle size is optimal!')
  }

  // Performance recommendations
  console.log('\n🚀 Performance Recommendations:')
  console.log('  - Use React.memo for expensive components')
  console.log('  - Implement virtual scrolling for large lists')
  console.log('  - Optimize images with WebP format')
  console.log('  - Enable gzip compression on server')
  console.log('  - Use service workers for caching')

  // Generate performance report
  const report = {
    timestamp: new Date().toISOString(),
    totalSize: totalSize,
    totalSizeKB: Math.round(totalSize / 1024),
    files: fileAnalysis,
    recommendations: getRecommendations(totalSize, fileAnalysis)
  }

  await fs.writeFile('performance-report.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Performance report saved to performance-report.json')
}

function getFileType(filename) {
  if (filename.includes('vendor')) return 'vendor'
  if (filename.includes('index')) return 'main'
  if (filename.includes('chunk')) return 'chunk'
  return 'other'
}

function getEmoji(type) {
  switch (type) {
    case 'vendor': return '📦'
    case 'main': return '🏠'
    case 'chunk': return '🧩'
    default: return '📄'
  }
}

function getRecommendations(totalSize, files) {
  const recommendations = []
  
  if (totalSize > MAX_BUNDLE_SIZE) {
    recommendations.push('Consider code splitting to reduce bundle size')
  }
  
  const largeFiles = files.filter(f => f.size > MAX_CHUNK_SIZE)
  if (largeFiles.length > 0) {
    recommendations.push(`Large files detected: ${largeFiles.map(f => f.file).join(', ')}`)
  }
  
  return recommendations
}

analyzeBuild().catch(console.error)