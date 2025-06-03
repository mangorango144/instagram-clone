import { useEffect, useState } from "react";
import { Post } from "./Post";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../config";
import { PostType } from "../../types";

export function Posts() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, "posts"), limit(10));
        const snapshot = await getDocs(q);
        const data: PostType[] = snapshot.docs.map((doc) => ({
          postId: doc.id,
          ...(doc.data() as Omit<PostType, "postId">),
        }));
        setPosts(data);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
}
