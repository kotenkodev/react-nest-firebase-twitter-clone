import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "@/services/usersService";
import { useAuthStore } from "@/store/useAuthStore";
import type { UpdateUser } from "@/types/user.types";
import { userKeys } from "@/lib/queryKeys";

interface UpdateUserVariables {
  id?: string;
  data: UpdateUser;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, setUser } = useAuthStore();

  const { mutateAsync: updateUser, isPending } = useMutation({
    mutationFn: ({ id, data }: UpdateUserVariables) => {
      const targetId = id || currentUser?.id;
      if (!targetId) {
        return Promise.reject(new Error("No user ID provided or logged in."));
      }
      return updateUserApi(targetId, data);
    },
    onSuccess: (updatedUser, { id }) => {
      const targetId = id || currentUser?.id;
      if (targetId) {
        queryClient.setQueryData(["user", null], updatedUser);
        if (targetId === currentUser?.id) {
          setUser(updatedUser);
        }
      }
    },
  });

  return { updateUser, isPending };
};
