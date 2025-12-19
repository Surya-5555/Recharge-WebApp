import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      // Remove auth user from cache
      queryClient.removeQueries({ queryKey: ["authUser"] });
      // Show success message
      toast.success("Logged out successfully");
      // Redirect to login page
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to logout");
      // Even if logout fails, redirect to login for security
      navigate("/login", { replace: true });
    }
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;