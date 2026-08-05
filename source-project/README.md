# Kawaii Factory（開拓村 MVP）

可愛い世界観 × 工業自動化 × 厳選 × 惑星開拓構想の **最初のステージ（開拓村）だけを
切り出したベース実装**です。ここでコアループが面白いかを検証し、良ければ工業都市→惑星→
星間スケールへとノードを追加していく前提で作っています。

## コアループ

```
探索（ダンジョン）→ 素材入手 → 生産ライン（畑→水車→パン工房→配送）
    ↓                                          ↓
仲間ガチャ（種をRNGで引く）→ 調練（工業工程で確定）→ 建物に配属してボーナス
    ↓
研究ツリーで新しい建物・仕組みを解放
```

厳選の考え方は「**RNGで種を引き、決定論的な工程で仕上げる**」の二段構成です。
`src/systems/gacha.ts` で潜在値（種）を抽選し、`src/systems/tempering.ts` で
調練完了時に確定ステータスへ変換します。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開くと動きます。

```bash
npm run build     # 型チェック + 本番ビルド (dist/ に出力)
npm run preview   # ビルド結果をローカルで確認
```

## ディレクトリ構成

```
src/
  types.ts             # ゲーム全体の型定義
  data/                # 静的なゲームデータ（建物・研究・ダンジョン・キャラ）
  state/store.ts        # Zustandによる状態管理（ゲームロジックの本体）
  systems/             # 純粋関数化したロジック（生産tick / ガチャ / 調練）
  components/          # 画面（村・ダンジョン・工場・仲間・研究の5タブ）
  styles/              # デザイントークン（tokens.css）とグローバルCSS
```

- セーブは `localStorage` に自動保存されます（`zustand/persist`）。
- 数値はまだ `number` 型のみです。惑星スケール以降で `10^40` 級の値を扱う場合は
  BigNumber表現への切り替えが必要になります。

## 現状の実装範囲（MVP）

- ダンジョン探索1本（はじまりの森）とドロップテーブル
- 生産チェーン1本：畑 → 水車小屋 → パン工房 → 配送ステーション
- 仲間ガチャ + 調練（厳選対象：仲間キャラのみ。装備/ペット/ブループリントは未実装）
- 研究ツリー8ノード（材料/生体/物流/開拓の4分野マトリクスへの拡張を想定した最小構成）
- 幸福度メーターとマイルストーン表示

## 未実装・拡張ポイント（次のステップの候補）

- [ ] 装備・部品の厳選（案4の深い加工チェーンを厳選の仕上げ工程として実装）
- [ ] ダンジョンのモンスター捕獲・自動繁殖ライン（ペット厳選）
- [ ] 輸送手段の追加（ベルト以外：ドローン・列車・ワープゲート）
- [ ] ブループリント（工場レイアウト）の保存・共有・最適化パズル
- [ ] オフライン時間の生産計算（現在はページを開いている間のみtickが進む）
- [ ] BigNumber対応（惑星/星間ステージ向け）
- [ ] 研究ツリーの4分野マトリクス化とノード数の拡張

## GitHubに上げる手順

```bash
git init
git add .
git commit -m "Initial commit: kawaii factory MVP (village stage)"
git branch -M main
git remote add origin <あなたのリポジトリURL>
git push -u origin main
```

## GitHub Pagesで公開する手順

このリポジトリには `.github/workflows/deploy.yml` が入っており、`main` に push すると
自動で `npm run build` → GitHub Pages への公開まで行われます。

1. GitHubのリポジトリページで **Settings → Pages** を開く
2. "Build and deployment" の **Source** を `GitHub Actions` に変更する
3. `main` ブランチに push する（すでにpush済みなら、空コミットでもう一度pushでOK）
4. **Actions** タブでワークフローが緑（成功）になったら、Pages の設定画面に表示される
   URL（`https://<ユーザー名>.github.io/<リポジトリ名>/` の形式）にアクセスする

### 画面が真っ白/何も表示されない場合によくある原因

- **Source が `Deploy from a branch` のまま** になっている
  → TypeScriptのソース(`src/main.tsx`)がそのまま配信されてもブラウザは実行できないため、
    上記の手順2で `GitHub Actions` に変更する必要があります。
- **Actionsが失敗している** → Actionsタブでログを確認してください。
- **ブラウザのキャッシュ** → 一度スーパーリロード（Cmd/Ctrl+Shift+R）を試してください。
