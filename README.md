# meet_hub

イベント募集・参加プラットフォームです。

ユーザー登録を行い、
イベントの作成・参加・コメント・ブックマーク・DMなどを行うことができます。

Next.js App Router を用いて、
認証・CRUD・通知機能を含むフルスタックアプリとして開発しました。

## URL

https://meet-hub-mu.vercel.app

## 使用技術

### フロントエンド

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### バックエンド

- NextAuth.js
- Prisma
- PostgreSQL (Neon)
- Route Handlers

### バリデーション / フォーム

- react-hook-form
- zod

### インフラ構成

- Vercel
- Neon

## 主な機能

### 認証機能

- GitHubログイン
- ログアウト
- オンボーディング

### イベント機能

- イベント作成
- イベント編集
- イベント削除
- イベント詳細表示

### ユーザー機能

- プロフィール編集
- フォロー機能
- ブックマーク機能

### コミュニケーション機能

- コメント投稿
- DM機能
- 通知機能

### その他

- ページネーション
- レスポンシブ対応

## 工夫した点

- App Routerを利用した構成
- Route Handlers経由でDB操作を実装
- Prismaを利用したデータ管理
- react-hook-form + zod によるフォームバリデーション
- Server Component / Client Component を用途に応じて使い分け
- 再利用性を意識したコンポーネント設計
- 通知機能やDM機能など、
  実際のSNS系サービスを意識した機能設計

## スクリーンショット

※ UI/UX改善中のため、
スクリーンショットは今後追加予定です。

### トップページ

<img width="1470" height="802" alt="top" src="https://github.com/user-attachments/assets/af02e93f-d5af-4e16-92e6-718e72125086" />


<img width="1470" height="800" alt="top2" src="https://github.com/user-attachments/assets/d07c137d-eb7e-4b21-a0f0-4f2cf0fe3aca" />
