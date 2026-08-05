# astral-factory

このzipには2種類のものが入っています。**やりたいことに応じて使う場所が違います。**

```
astral-factory-release/
├── index.html, assets/         ← ①そのまま公開するためのビルド済みファイル
└── source-project/             ← ②今後コードを直す・機能を足すための開発用ソース一式
```

---

## ① とにかく今すぐサイトを表示したいだけの場合

**このフォルダの中身（`index.html` と `assets/` フォルダ）を、GitHubリポジトリの
直下にそのままアップロードしてください。** `source-project/` は要りません。

1. GitHubのリポジトリを開く（空でも上書きでもOK）
2. **Add file → Upload files** を開く
3. `index.html` と `assets` フォルダをドラッグ＆ドロップ（`source-project`は入れない）
4. `Commit changes` する
5. **Settings → Pages** を開き、Source を **`Deploy from a branch`**、ブランチは
   `main` / `/(root)` を選んで **Save**
6. 1〜2分待って `https://<ユーザー名>.github.io/<リポジトリ名>/` を開く

これだけです。**GitHub Actionsもnpmもビルドも一切不要**です
（ここに入っているのは既にビルド済みの静止ファイルなので）。

> 前回まで問題になっていた「`.github`フォルダがドラッグ&ドロップで消える」現象を
> 根本的に避けるため、この方法では隠しフォルダを一切使いません。

---

## ② 今後コードを直したり機能を追加していきたい場合

`source-project/` の中身を使ってください。React + TypeScript + Vite のプロジェクト一式です。

```bash
cd source-project
npm install
npm run dev
```

開発が終わって公開し直したいときは、

```bash
npm run build
```

で `source-project/dist/` の中に最新のビルド済みファイルが生成されるので、
その中身（`index.html` と `assets/`）を①の手順と同じようにリポジトリ直下へ
アップロードし直せば更新完了です。

`source-project/README.md` に、GitHub Actionsを使った自動デプロイの設定方法も
書いてあります（コマンドラインでgitを使える場合はそちらの方が毎回の手作業が減ります）。

---

## ゲームの内容について

可愛い世界観×工業自動化×厳選をテーマにした、開拓村ステージのMVPです。
詳しい設計や今後の拡張方針は `source-project/README.md` を参照してください。
