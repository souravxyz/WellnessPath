import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicSessions,
  getMySessions,
  getSessionById,
  getPublicSessionById,
  saveDraftSession,
  publishSession,
  deleteSession,
} from "../../api/apiHandler";
import { toast } from "react-toastify";

// Public sessions list
export function usePublicSessions() {
  return useQuery({
    queryKey: ["publicSessions"],
    queryFn: getPublicSessions,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Public session details
export function useSinglePublicSession(id) {
  return useQuery({
    queryKey: ["publicSession", id],
    queryFn: () => getPublicSessionById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// My sessions list
export function useMySessions() {
  return useQuery({
    queryKey: ["mySessions"],
    queryFn: getMySessions,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    staleTime: 0,
  });
}

// My session details
export function useSingleSession(id) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Save draft
export function useSaveDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDraftSession,
    onSuccess: () => {
      // toast.success("Draft saved");
      queryClient.invalidateQueries({ queryKey: ["mySessions"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to save draft");
    },
  });
}

// Publish session
export function usePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishSession,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["mySessions"] });

      const previousSessions = queryClient.getQueryData(["mySessions"]);

      queryClient.setQueryData(["mySessions"], (old) => {
        if (!old) return old;
        return old.map((session) =>
          session._id === id || session.id === id
            ? { ...session, status: "published" }
            : session
        );
      });

      return { previousSessions };
    },
    onError: (err, variables, context) => {
      toast.error(err?.response?.data?.message || "Failed to publish session");
      if (context?.previousSessions) {
        queryClient.setQueryData(["mySessions"], context.previousSessions);
      }
    },
    onSuccess: () => {
      toast.success("Session published");
      queryClient.invalidateQueries({ queryKey: ["mySessions"] });
      queryClient.invalidateQueries({ queryKey: ["publicSessions"] });
    },
  });
}

//delet session
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["mySessions"] });

      const previousSessions = queryClient.getQueryData(["mySessions"]);

      queryClient.setQueryData(["mySessions"], (old) =>
        old?.filter((session) => session._id !== id && session.id !== id)
      );

      return { previousSessions };
    },
    onError: (err, id, context) => {
      toast.error(err?.response?.data?.message || "Failed to delete session");
      if (context?.previousSessions) {
        queryClient.setQueryData(["mySessions"], context.previousSessions);
      }
    },
    onSuccess: () => {
      toast.success("Session deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["mySessions"] });
      queryClient.invalidateQueries({ queryKey: ["publicSessions"] });
    },
  });
}
