import React from "react";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">GraphQL Blog</h1>
        <p className="text-gray-600 mt-1">Federated schema demo application</p>
      </div>
    </header>
  );
}

export default Header;
