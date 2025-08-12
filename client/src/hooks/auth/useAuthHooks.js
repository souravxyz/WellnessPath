// hooks/useAuthHooks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPasswordWithToken,
  changePassword,
} from "../../api/apiHandler";
import { toast } from "react-toastify";

/* ----------------------------- AUTH HOOK ----------------------------- */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Register
  const register = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful! Please check your email.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Registration failed");
    },
  });

  // Login
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: async (res) => {
      localStorage.setItem("token", res.token);
      await queryClient.invalidateQueries(["myProfile"]);
      toast.success("Welcome back!");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Login failed");
    },
  });

  // Logout
  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.removeQueries(["myProfile"]);
      toast.info("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return { register, login, logout };
};

/* ---------------------------- PROFILE HOOK ---------------------------- */
export const useProfile = () => {
  const queryClient = useQueryClient();

  // Fetch profile
  const myProfile = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMe,
  });

  // Update profile
  const update = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      toast.success(res?.message || "Profile updated");
      queryClient.invalidateQueries(["myProfile"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  return { myProfile, update };
};

/* --------------------------- PASSWORD HOOK ---------------------------- */
export const usePassword = () => {
  const navigate = useNavigate();

  // Forgot password
  const forgot = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Reset link sent! Check your email.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send reset link");
    },
  });

  // Reset password via token
  const reset = useMutation({
    mutationFn: resetPasswordWithToken,
    onSuccess: () => {
      toast.success("Password reset successful!");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Reset failed");
    },
  });

  // Change password while logged in
  const change = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Change password failed");
    },
  });

  return { forgot, reset, change };
};
