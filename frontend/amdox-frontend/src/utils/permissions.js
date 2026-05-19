export const hasPermission =
  (
    permissions,
    permission
  ) => {

    if (!permissions)
      return false;

    return permissions.includes(
      permission
    );
  };