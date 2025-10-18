import { NextRequest, NextResponse } from 'next/server';
import { createJwtSupabaseClient } from '@/lib/supabase-client';

// GET: 自分の投稿一覧取得
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'JWT required' }, { status: 401 });
  }
  const jwt = authHeader.replace('Bearer ', '');
  const supabase = createJwtSupabaseClient(jwt);
  const { data, error } = await supabase
    .from('posts_private')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ posts: data });
}

// POST: 新規投稿（user_idはJWTのsubと一致している必要あり）
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'JWT required' }, { status: 401 });
  }
  const jwt = authHeader.replace('Bearer ', '');
  const supabase = createJwtSupabaseClient(jwt);
  const body = await req.json();
  const { user_id, content } = body;
  const { data, error } = await supabase
    .from('posts_private')
    .insert([{ user_id, content }])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ post: data?.[0] });
}
