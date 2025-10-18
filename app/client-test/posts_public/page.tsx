"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function PostsPublicClient() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  async function fetchPosts() {
    setError("");
    const res = await fetch("/api/posts_public");
    const data = await res.json();
    if (res.ok) setPosts(data.posts);
    else setError(data.error);
  }

  async function submitPost() {
    setError("");
    // ログイン中ならuser_idを自動で送信
    const user_id = session?.user?.id ?? null;
    const res = await fetch("/api/posts_public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, content }),
    });
    const data = await res.json();
    if (res.ok) {
      setContent("");
      fetchPosts();
    } else setError(data.error);
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>🌐 Public Posts (認証不要)</h2>
      {/* user_id入力欄は不要 */}
      <textarea
        placeholder="content"
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={submitPost}>投稿</button>
      <button onClick={fetchPosts} style={{ marginLeft: 8 }}>
        投稿一覧取得
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <b>{p.user_id}</b>: {p.content} <i>{p.created_at}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
