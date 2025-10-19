# JWT × Supabase RLS 設計メモ（改訂版）

## 構成概要

- 認証: better-auth（JWT発行, JWKS提供）
- DB: Supabase（PostgreSQL, RLS有効）
- JWT: AuthorizationヘッダーでAPIリクエスト
- RLS: JWTのclaimでアクセス制御

---

## 1. JWT設計（better-auth側）

- alg: **RS256**（非対称署名）
- better-authで生成された公開鍵をSupabaseの`jwt.secret`に**PEM形式**で設定．秘密鍵はbetter-auth側で厳重管理．
- payload例: RLSで使用するため，必要最小限のclaimを定義．`sub`はRLSで`id`との比較に必須．

```json
{
  "sub": "ユーザID",
  "email": "メールアドレス",
  "role": "ユーザ権限",
  "exp": 1678886400 // 有効期限は expirationTime で自動付与
}
```

### 設定例: `lib/auth.ts`（RS256採用）

```typescript
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  // ...他の設定...
  plugins: [
    jwt({
      // 1. RS256 (非対称署名) の設定
      jwks: {
        keyPairConfig: {
          alg: "RS256", // 標準表記に統一
          modulusLength: 4096 // セキュリティ強化のため鍵長を4096bitに設定
        }
      },
      jwt: {
        // 2. JWTのペイロードをカスタマイズ (RLSで使用)
        definePayload: ({ user }) => ({
          sub: user.id,
          email: user.email,
          role: user.role
        }),
        // 3. JWTの有効期限を短く設定 (例: 15分)
        expirationTime: "15m" 
      }
    })
  ]
});
```

---

## JWKSエンドポイントの検証例（Node.js, jose）

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(new URL('https://your-app.com/api/auth/jwks'));

async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: 'https://your-app.com',
    audience: 'https://your-app.com'
  });
  return payload;
}
```

---

## リフレッシュトークン失効API例

```typescript
// POST /api/auth/logout
export async function logout(req, res) {
  // リフレッシュトークンをDBで失効
  await db.invalidateRefreshToken(req.cookies.refreshToken);
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true });
}
```

---

## 2. Supabase RLSポリシー例

- JWTのclaim（sub, role, email）でアクセス制御を行う．

```sql
-- ユーザ自身のみアクセス可 (sub claimを使用)
CREATE POLICY "Users can access their own data" ON users
  FOR SELECT USING (auth.jwt() ->> 'sub' = id::text); -- idがUUID/textでない場合はキャストに注意

-- 管理者権限 (role claimを使用)
CREATE POLICY "Admins can access all data" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 特定のロールのみ書き込み可
CREATE POLICY "Creators can insert new posts" ON posts
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'creator');
```

（id型に応じてキャストを調整すること）

---

## 3. 運用・セキュリティベストプラクティス

- **公開鍵の設定**: better-authが生成したRS256の公開鍵をPEM形式でSupabaseに設定（`ALTER DATABASE ... SET jwt.secret = '...'`）．
- **鍵管理**: 秘密鍵はopenssl等で生成し，**KMS (Key Management Service)** や環境変数で厳重管理．
- **トークン戦略**:
  - JWT (Access Token) は短命（15分）．
  - リフレッシュトークンは**HttpOnly, Secure Cookie**で保存し，サーバー側（better-auth側）のDBで失効管理を**必須**とする．
  - 失効API例は上記参照．
- **Claimの原則**: `sub`, `role`, `email`など，アクセス制御に必要な最小限のデータのみを含める．
- **RLS**: RLSポリシーはSQLでバージョン管理し，テスト手順もドキュメントに記載．
- **失効対応**: JWTの即時失効は，原則としてAccess Tokenの**期限切れに委ねる**．全ユーザの強制ログアウトが必要な場合は，better-auth側での**鍵のローテーション**で対応．
- **監査ログ**: JWT発行・リフレッシュ・失効・認証失敗など主要イベントは監査ログに記録．
- **通信**: HTTPS必須．
- **鍵ローテーション手順**: 運用時の鍵の安全な切り替え（Supabaseとbetter-auth双方）は運用ドキュメント参照．

---
