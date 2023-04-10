/* eslint no-console: 0 */

const { readFileSync } = require('fs')
const path = require('path')
const { globSync } = require('glob')
const htmlparser2 = require('htmlparser2')

const contentDir = `${__dirname}/../dist`

const allPages = {}
const brokenLinks = []

const htmlFiles = globSync(`${contentDir}/**/*.html`)
for (const file of htmlFiles) {
  const pagePath = file.replace(/^.*dist/, '').replace(/index\.html$/, '')
  allPages[pagePath] = true
}

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf-8')
  const dom = htmlparser2.parseDocument(content)
  const links = htmlparser2.DomUtils.getElementsByTagName('a', dom, true)
  for (const link of links) {
    const href = link.attribs.href
    const basePath = file.replace(/^.*dist/, '').replace(/index\.html$/, '')
    const rootPath = href.startsWith('/') ? href : path.normalize(`${basePath}${href}`)
    if (!allPages[rootPath] && !allPages[rootPath + '/']) {
      brokenLinks.push(`Broken link: ${href} in ${file}`)
    }
  }
}

if (brokenLinks.length === 0) {
  console.log('✨ No broken links')
  process.exit(0)
}

console.log('🚨 Broken links found')
for (const brokenLink of brokenLinks) {
  console.log(brokenLink)
}
process.exit(1)
