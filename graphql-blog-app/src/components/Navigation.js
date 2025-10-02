import React from "react";

function Navigation({ currentView, onViewChange }) {
  const tabs = [
    { id: "posts", label: "All Posts" },
    { id: "topPosts", label: "Top Posts" },
    { id: "users", label: "Authors" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === tab.id ||
                (currentView === "postDetail" && tab.id === "posts")
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
