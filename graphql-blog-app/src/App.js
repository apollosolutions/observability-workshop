import React, { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PostsPage from "./pages/PostsPage";
import TopPostsPage from "./pages/TopPostsPage";
import UsersPage from "./pages/UsersPage";
import PostDetail from "./components/PostDetail";

function App() {
  const [view, setView] = useState("topPosts");
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handlePostSelect = (postId) => {
    setSelectedPostId(postId);
    setView("postDetail");
  };

  const handleBackToPosts = () => {
    setSelectedPostId(null);
    setView("topPosts");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentView={view} onViewChange={setView} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === "postDetail" && selectedPostId ? (
          <PostDetail postId={selectedPostId} onBack={handleBackToPosts} />
        ) : view === "posts" ? (
          <PostsPage onPostSelect={handlePostSelect} />
        ) : view === "topPosts" ? (
          <TopPostsPage onPostSelect={handlePostSelect} />
        ) : view === "users" ? (
          <UsersPage />
        ) : null}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>GraphQL Federated Blog Application</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
