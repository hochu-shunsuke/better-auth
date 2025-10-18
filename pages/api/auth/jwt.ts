import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import { issueJwt } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Node.jsヘッダーをWeb Headersに変換
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      headers.set(key, value.join(','));
    } else {
      headers.set(key, value);
    }
  }

  // サーバーサイドでセッション取得
  const sessionResult = await auth.api.getSession({
    headers,
  });

  if (!sessionResult?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const jwt = await issueJwt(sessionResult.user);
    return res.status(200).json({ token: jwt });
  } catch (e) {
    return res.status(500).json({ error: 'JWT issuance failed', detail: String(e) });
  }
}
