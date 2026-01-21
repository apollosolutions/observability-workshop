import React from "react";

function UserList({ users }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{user.bio}</p>
          <p className="text-sm text-gray-500">
            📍 {user.address.city}, {user.address.state}, {user.address.country}
          </p>
        </div>
      ))}
    </div>
  );
}

export default UserList;
