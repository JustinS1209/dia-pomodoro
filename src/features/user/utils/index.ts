export function getNtUserByUserPrincipalName(userPrincipalName: string) {
  return userPrincipalName
    .substring(0, userPrincipalName.indexOf("@"))
    .toUpperCase();
}

export function getUserPrincipalNameByNtUser(ntUser: string) {
  return ntUser + "@bosch.com";
}
