# Better Auth (Email & Password ,Social Sign-On Only)

このプロジェクトは，[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) を使用して **[Next.js](https://nextjs.org)** で構築されています．
better-authが提供しているNext.js用のデモアプリ[(こちらから)](https://github.com/better-auth/better-auth/tree/canary/demo/nextjs)から不要部分を削り，一部処理を変更して使いやすくしました．

## 仕様

- 基本的には公式の[デモアプリ](https://github.com/better-auth/better-auth/tree/canary/demo/nextjs)をクローンしています．
- 特定の個人的な用途として使いやすいようにbetter-authの未使用機能の部分を削減しています．
- supabaseをデータベースとして扱い，認証を行います．
- 認証方法としてはメール認証，ソーシャル認証(Google,Github)のみ残しています．
- 認証後にjoseを使用しjwtを生成し，supabaseに送信することでsupabaseの認証/未認証クライアントを作成します．

---

## 始める前に

アプリをローカルで実行するための手順は次のとおりです．

### 前提条件

1. **リポジトリをクローンする**:

```bash
git clone https://github.com/hochu-shunsuke/better-auth
cd better-auth
````

2.  **依存関係をインストールする**:

```bash
 npm install
 # または
 yarn install
 # または
 pnpm install
```

3. **環境変数を設定する**:

- `.env.example` ファイルを `.env.local` に名前変更します．

```bash
mv .env.example .env.local
```

- `.env.local` を開いて，必要な詳細を記入します．これには，Better Auth サービスに接続するために必要な API URL，クライアント ID，シークレットなどが含まれます．
- supabaseで新規データベースを作成し，「Connect to your project」→「Session pooler」から取得できるアドレスを`DATABASE_URL`として設定してください．
  - ローカル環境のみで使用する場合は「Connect to your project」→「Direct connection」でも構いませんが，デプロイする環境によりipv4のアクセスができないことを注意してください．

4. *supabaseの環境をセットする*:

ターミナルで以下のコマンドを実行してください．

```bash
npx @better-auth/cli@latest generate
npx @better-auth/cli@latest migrate
```

(この時点でエラーがある場合は，`DATABASE_URL`のセッティングを確認してください．)


### 開発サーバーを起動する

すべて設定が完了したら，次のコマンドで開発サーバーを起動します．

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

アプリは [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) で公開されます．ブラウザで開き，すぐに利用を開始できます！

`app/page.tsx` を修正してアプリを自由に編集してください．変更を加えると，ブラウザに自動的に反映されます．

---

## 機能

このアプリがすぐにサポートしている機能は次のとおりです．

- **[Eメールとパスワード](https://www.better-auth.com/docs/basic-usage#email-password)**: シンプルで安全な認証．
- **[ロールと権限](https://www.better-auth.com/docs/plugins/admin#role)**: 誰が何ができるかを定義し，管理します．
- **[レート制限](https://www.better-auth.com/docs/concepts/rate-limit)**: スマートな制限で，アプリを不正利用から保護します．
- **[セッション管理](https://www.better-auth.com/docs/concepts/session-management)**: ユーザーセッションをシームレスに処理します．
- **ソーシャル認証**: ソーシャル認証は，Googleとgithubを実装しました．
- **[jwtによる認証](https://www.better-auth.com/docs/plugins/jwt)**: better-authを仕様しjwtを生成し，supabaseで検証します．
- **supabaseの認証/未認証クライアント**: supabase-jsとjwtを仕様し，認証/未認証の両方のsupabaseクライアントを作成します．

---

## 詳細情報

さらに詳しく知りたい場合は，役立つリンクをいくつかご紹介します．

- [Better Auth ドキュメント](https://better-auth.com/docs) - Better Auth を統合するために知っておくべきすべての情報．
- [Next.js ドキュメント](https://nextjs.org/docs) - このアプリの構築に使用されたフレームワークについて学びます．
- [Next.js を学ぶ](https://nextjs.org/learn) - Next.js の実践的なチュートリアル．

---

問題が発生したり，提案がある場合は，お気軽に Issue を開くか，プルリクエストを送信してください．

Happy coding!
