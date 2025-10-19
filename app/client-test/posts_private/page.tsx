"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function PostsPrivateClient() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    setError("");
    setLoading(true);
    let jwt = "";
    try {
      const res = await fetch("/api/auth/jwt");
      const data = await res.json();
      if (!res.ok || !data.token) {
        setError("JWT取得失敗: " + (data.error || ""));
        setLoading(false);
        return;
      }
      jwt = data.token;
    } catch (e) {
      setError("JWT取得失敗: " + String(e));
      setLoading(false);
      return;
    }
    const res = await fetch("/api/posts_private", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setPosts(data.posts);
    else setError(data.error);
  }

  async function submitPost() {
    setError("");
    setLoading(true);
    let jwt = "";
    try {
      const resJwt = await fetch("/api/auth/jwt");
      const dataJwt = await resJwt.json();
      if (!resJwt.ok || !dataJwt.token) {
        setError("JWT取得失敗: " + (dataJwt.error || ""));
        setLoading(false);
        return;
      }
      jwt = dataJwt.token;
    } catch (e) {
      setError("JWT取得失敗: " + String(e));
      setLoading(false);
      return;
    }
    const user_id = session?.user?.id ?? null;
    const res = await fetch("/api/posts_private", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ user_id, content }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setContent("");
      fetchPosts();
    } else setError(data.error);
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>🔒 Private Posts (JWT自動付与)</h2>
      <textarea
        placeholder="content"
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={submitPost} disabled={loading}>投稿</button>
      <button onClick={fetchPosts} style={{ marginLeft: 8 }} disabled={loading}>
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
