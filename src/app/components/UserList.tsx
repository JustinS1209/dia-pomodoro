"use client";

import { useDbUsers } from "@/features/user/hooks/useDbUsers";

export const UserList = () => {
  const { data: users, isLoading, isError } = useDbUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching users</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Users from DB</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
