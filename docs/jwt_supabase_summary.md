# Supabase × JWT × RLS セキュア認証運用まとめ

## 目的

- 独自ES256鍵ペアでJWTを発行し，SupabaseのRLS（Row Level Security）で安全に認証・認可を行う
- better-authで認証，joseでJWT署名，SupabaseでJWT検証

## 鍵管理・生成手順

1. **秘密鍵（PKCS#8 PEM）生成**

   ```sh
   openssl ecparam -name prime256v1 -genkey -noout -out ec256-private.pem
   openssl pkcs8 -topk8 -nocrypt -in ec256-private.pem -out ec256-private-pkcs8.pem
   ```

2. **d付きJWK（秘密鍵JWK）生成（jose@5系）**

   ```js
   const { importPKCS8, exportJWK } = require('jose');
   const { readFileSync } = require('fs');
   const privateKeyPem = readFileSync('./ec256-private-pkcs8.pem', 'utf8');
   (async () => {
     const privateKey = await importPKCS8(privateKeyPem, 'ES256');
     const jwk = await exportJWK(privateKey);
     jwk.kid = 'uuidgenで生成したkid';
     console.log(JSON.stringify(jwk, null, 2));
   })();
   ```

3. **SupabaseのCurrent keyにd付きJWKを登録**
   - kidは大文字小文字まで完全一致させる

## .env.local 設定例

```env
JWT_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PRIVATE_KEY_KID=11949D79-919C-408E-A3CF-8817F963E1B1
JWT_ISSUER=orcareer
JWT_AUDIENCE=https://xxxx.supabase.co
```

## JWT発行・検証フロー

- joseでES256署名，kid/alg/iss/audを正しくセット
- JWTのsubにユーザーIDを入れる
- SupabaseのCurrent key（d付きJWK）で検証

## Postgresロール・権限

- create role "user" with login;
- grant "user" to authenticated;
- grant select, insert, update, delete on table posts_private to "user";

## RLS（Row Level Security）

- RLS有効化: `alter table posts_private enable row level security;`
- ポリシー例:

  ```sql

    create policy select_own_posts on posts_private
    for select using (auth.jwt() ->> 'sub' = user_id);

    create policy insert_own_posts on posts_private
    for insert with check (auth.jwt() ->> 'sub' = user_id);

    create policy select_all on posts_public
    for select using (true);

    create policy insert_all on posts_public
    for insert with check (true);
  ```

## よくあるエラーと対策

- kidの大文字小文字不一致 → 完全一致に修正
- role "user" does not exist → create role "user" with login;
- permission denied to set role "user" → grant "user" to authenticated;
- permission denied for table ... → grant ... on table ... to "user";

## セキュリティ注意

- 秘密鍵PEM・d付きJWKは絶対に外部に漏らさない
- SupabaseのCurrent keyはd付きJWK必須（現仕様）
- RLSとPostgres権限でユーザーごとに厳密に制御

---

この手順・構成で，Supabase × JWT × RLSの安全な認証・認可が実現できます．
