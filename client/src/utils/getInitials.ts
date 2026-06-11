export const getInitials = (name: string) => {
  if (!name) return "";

  const nameParts = name.split(" ");

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  const initials =
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);

  return initials.toUpperCase();
};
