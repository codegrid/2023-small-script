/* eslint no-console: 0 */ // `console.log()`があってもESLintでエラーにならないようにする

const { readFileSync } = require('fs')
const path = require('path')
const { globSync } = require('glob')
const htmlparser2 = require('htmlparser2')

if (process.argv.length < 3) {
  // 対象ディレクトリが指定されなかった場合はエラーを出力して終了
  console.log('Please provide a path to the target directory')
  process.exit(1)
}

const targetDirPath = path.join(process.cwd(), process.argv[2])

const joinPath = (filePath, href) => {
  // 相対パス指定のhref属性値を絶対パスに変換する関数
  const dirPath = path.dirname(filePath) // `index.html`を除いたディレクトリのパス
  const hrefPath = href.startsWith('/')
    ? path.join(targetDirPath, href) // `/`から始まる場合は`targetDirPath`からの絶対パス
    : path.join(dirPath, href) // そうでない場合は`dirPath`からの相対パス
  if (path.extname(hrefPath) !== '') return hrefPath
  return path.join(hrefPath, '/index.html') // ディレクトリの場合は`index.html`を付与する
}

const brokenLinks = []
const filePaths = new Set(globSync(`${targetDirPath}/**/*.html`))

for (const filePath of filePaths) {
  const content = readFileSync(filePath, 'utf-8')
  const dom = htmlparser2.parseDocument(content)
  const links = htmlparser2.DomUtils.getElementsByTagName('a', dom, true)

  for (const link of links) {
    const href = link.attribs.href

    // http(s)://から始まるURL以外で、リンク先ファイルが存在しない場合はリンク切れとして`brokenLinks`に追加する
    if (!/^https?:\/\//.test(href) && !filePaths.has(joinPath(filePath, href))) {
      brokenLinks.push(`Broken link: ${href} in ${filePath}`)
    }
  }
}

// 結果を出力する
if (brokenLinks.length === 0) {
  console.log('✨ No broken links')
  process.exit(0)
}

console.log('🚨 Broken links found')
for (const brokenLink of brokenLinks) {
  console.error(brokenLink)
}
process.exit(1)
