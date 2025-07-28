import { graphAxios } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GraphUser } from "@/features/user/configurations/types";
import { fromPairs, sortBy } from "lodash";
import {
  getNtUserByUserPrincipalName,
  getUserPrincipalNameByNtUser,
} from "@/features/user/utils";

type Filter = {
  search?: string;
  ntUsers?: string[];
};

const fetchUsers = async (filter: Filter) => {
  const hasSearchQuery = !!filter.search && filter.search.length > 0;
  const hasNtUsers = !!filter.ntUsers && filter.ntUsers.length > 0;

  if (!hasSearchQuery && !hasNtUsers) {
    return [];
  }

  let searchParameters: Array<string> = [];

  if (hasNtUsers) {
    searchParameters = [
      ...searchParameters,
      ...filter.ntUsers!.map(
        (ntUser) =>
          `userPrincipalName eq '${getUserPrincipalNameByNtUser(ntUser)}'`,
      ),
    ];
  }

  if (hasSearchQuery) {
    searchParameters = [
      ...searchParameters,
      `userPrincipalName eq '${filter.search}@bosch.com' OR startsWith(displayName, '${filter.search}') OR mail eq '${filter.search}' OR startsWith(givenName, '${filter.search}') `,
    ];
  }

  const urlStart = "users?$filter=";
  const chunkSize = 15;
  const searchParameterChunks: Array<Array<string>> = [];

  for (let i = 0; i < searchParameters.length; i += chunkSize) {
    searchParameterChunks.push(searchParameters.slice(i, i + chunkSize));
  }

  let graphUsers: GraphUser[] = [];

  await Promise.all(
    searchParameterChunks.map(async (chunk) => {
      const url = `${urlStart}${chunk.join(" OR ")}`;

      const users = (
        (await graphAxios.get(`https://graph.microsoft.com/v1.0/${url}`)) as any
      ).value as GraphUser[];

      graphUsers = [...graphUsers, ...users];
    }),
  );

  return graphUsers;
};

const buildQueryOptions = (filter: Filter) => ({
  queryKey: ["users", { filter }],
  queryFn: () => fetchUsers(filter),
});

export const useUsers = (filter: Filter) => {
  const queryClient = useQueryClient();

  const { data, ...result } = useQuery({
    ...buildQueryOptions(filter),
  });

  const prefetchUsers = async (filter: Filter) => {
    await queryClient.prefetchQuery(buildQueryOptions(filter));
  };

  const getSortedUsers = () => {
    if (!filter.ntUsers) return data || [];

    if (!data) return [];

    const ntUsersMap = fromPairs(
      filter.ntUsers!.map((item, index) => [item, index]),
    );
    return sortBy(
      data,
      (user) =>
        ntUsersMap[getNtUserByUserPrincipalName(user.userPrincipalName)],
    );
  };

  return {
    users: getSortedUsers(),
    ...result,
    prefetchUsers,
  };
};
