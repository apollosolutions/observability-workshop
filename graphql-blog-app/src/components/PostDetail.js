import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import client from "../graphql/client";
import { GET_POST } from "../graphql/queries";

function PostDetail({ postId, onBack }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await client.query(GET_POST, { id: postId });
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading post: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to posts
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        )}*/}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-lg text-gray-700 font-medium">
                {post.author.name}
              </p>
              <p className="text-sm text-gray-500">{post.author.email}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {post.author.bio && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">About the author</h3>
              <p className="text-gray-700">{post.author.bio}</p>
              {post.author.address && (
                <p className="text-sm text-gray-500 mt-2">
                  {post.author.address.city}, {post.author.address.state},{" "}
                  {post.author.address.country}
                </p>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default PostDetail;
