import { SignJWT, importPKCS8 } from 'jose';

interface JwtUser {
  id: string;
  email: string;
  [key: string]: any;
}

export async function issueJwt(user: JwtUser) {
  const privateKeyPEM = process.env.JWT_PRIVATE_KEY_PEM!;
  const alg = 'ES256';
  const privateKey = await importPKCS8(privateKeyPEM, alg);

  const { id, email, ...rest } = user;
  const payload = {
    sub: id,
    email,
    ...rest,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg, kid: process.env.JWT_PRIVATE_KEY_KID })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER!)
    .setAudience(process.env.JWT_AUDIENCE!)
    .setExpirationTime('1h')
    .sign(privateKey);
}
