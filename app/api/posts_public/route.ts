import { NextRequest, NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase-client';

// GET: 全投稿一覧取得（認証不要）
export async function GET() {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from('posts_public')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ posts: data });
}

// POST: 新規投稿（認証不要）
export async function POST(req: NextRequest) {
  const supabase = createPublicSupabaseClient();
  const body = await req.json();
  const { user_id, content } = body;
  // user_idが未指定ならnullで投稿
  const { data, error } = await supabase
    .from('posts_public')
    .insert([{ user_id: user_id ?? null, content }])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ post: data?.[0] });
}
