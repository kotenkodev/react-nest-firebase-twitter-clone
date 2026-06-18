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
    staleTime: 1000 * 60 * 5,
  });

  return { user: data, error, isPending };
};
