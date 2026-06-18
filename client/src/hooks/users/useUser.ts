import { userKeys } from "@/lib/queryKeys";
import { getUser } from "@/services/usersService";
import type { User } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";

export const useUser = (id?: string) => {
  const { data, error, isPending } = useQuery<User>({
    queryKey: userKeys.single(id!),
    queryFn: () => {
      return getUser(id!);
    },
  });

  return { user: data, error, isPending };
};
