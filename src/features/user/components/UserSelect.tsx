import { MultiSelect } from "@/features/common/components/MultiSelect";
import { useUsers } from "@/features/user/hooks/useUsers";
import * as React from "react";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { GraphUser } from "@/features/user/configurations/types";
import { getNtUserByUserPrincipalName } from "@/features/user/utils";
import { sortBy } from "lodash";

type UserSelectProps = {
  selected: string[];
  excluded: string[];
  handleUpdateSelectedGraphUser?: (
    updatedSelected: GraphUser[],
    value: GraphUser,
  ) => void;
  handleUpdateSelected?: (selected: string[], ntUser: string) => void;
  disabled?: boolean;
} & ComponentProps<"div">;

export default function UserSelect({
  selected,
  excluded,
  handleUpdateSelectedGraphUser,
  handleUpdateSelected,
  disabled,
  className,
}: UserSelectProps) {
  const [search, setSearch] = useState("");
  const {
    users: userOptions,
    isLoading,
    prefetchUsers: prefetchUserOptions,
  } = useUsers({ search });

  const { users: selectedUsers, isLoading: isSelectedUsersLoading } = useUsers({
    ntUsers: selected,
  });

  const previousSelectedUsers = useRef(selectedUsers);

  const [inputValue, setInputValue] = React.useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!isSelectedUsersLoading)
      previousSelectedUsers.current = [...selectedUsers];
  }, [isSelectedUsersLoading, selectedUsers]);

  useEffect(() => {
    if (inputValue.length === 0) {
      setWaiting(false);
      setSearch("");
      return;
    }

    setWaiting(true);
    const timeOutId = setTimeout(async () => {
      await prefetchUserOptions({ search: inputValue });
      setSearch(inputValue);
      setWaiting(false);
    }, 750);
    return () => clearTimeout(timeOutId);
  }, [inputValue]);

  // filter to be excluded users out and sort
  const preprocessedUsers =
    inputValue.length === 0
      ? []
      : sortBy(
          userOptions.filter((user) => {
            const ntUser = getNtUserByUserPrincipalName(user.userPrincipalName);
            return !excluded
              .map((ntUser) => ntUser.toUpperCase())
              .includes(ntUser.toUpperCase());
          }),
          (u) => u.displayName,
        );

  const handleUpdateSelectedGraphUsers = (
    updatedSelected: GraphUser[],
    value: GraphUser,
  ) => {
    handleUpdateSelected &&
      handleUpdateSelected(
        updatedSelected.map((user) =>
          getNtUserByUserPrincipalName(user.userPrincipalName),
        ),
        getNtUserByUserPrincipalName(value.userPrincipalName),
      );

    handleUpdateSelectedGraphUser &&
      handleUpdateSelectedGraphUser(updatedSelected, value);
  };

  return (
    <MultiSelect<GraphUser>
      className={className}
      disabled={disabled}
      getIdentifier={(user) => user.userPrincipalName}
      getLabel={(user) =>
        user.displayName +
        ` [${getNtUserByUserPrincipalName(user.userPrincipalName)}]`
      }
      handleUpdateValues={handleUpdateSelectedGraphUsers}
      inputValue={inputValue}
      isLoading={waiting || isLoading}
      options={preprocessedUsers}
      placeholder="Search NTUser or last name followed by first name"
      setInputValue={setInputValue}
      shouldFilter={false}
      values={
        isSelectedUsersLoading ? previousSelectedUsers.current : selectedUsers
      }
    />
  );
}
