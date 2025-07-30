import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@prisma/client";

const fetchUsers = async () => {
  const { data } = await axios.get<User[]>("/api/users");
  return data;
};

export const useDbUsers = () => {
  return useQuery({
    queryKey: ["db-users"],
    queryFn: fetchUsers,
  });
};
