# 2023-small-script

リンクをチェックするスクリプトのデモとデモサイトです。

### 準備
```
npm install
npm install --prefix ./scripts
```

### デモサイト
Astroでビルドされた静的サイトが`dist`ディレクトリに出力されます。

ビルド
```
npm run build
```

### リンクチェック
必要なパッケージはサイトの`npm install`時にインストールされます。
```
node ./scripts/linkCheck.cjs
```