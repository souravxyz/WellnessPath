import axiosInstance from "./axiosInstance";
import endpoints from "./endpoints";

// ---------- AUTH ----------
export const registerUser = async (formData) => {
  const res = await axiosInstance.post(endpoints.auth.register, formData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post(endpoints.auth.login, credentials);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.get(endpoints.auth.logout);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axiosInstance.post(endpoints.auth.forgotPassword, email);
  return res.data;
};

export const resetPasswordWithToken = async ({ token, newPassword }) => {
  const res = await axiosInstance.post(
    endpoints.auth.resetPasswordWithToken(token),
    { password: newPassword }
  );
  return res.data;
};

export const changePassword = async (data) => {
  const res = await axiosInstance.post(endpoints.auth.changePassword, data);
  return res.data;
};

// ---------- PROFILE ----------
export const getMe = async () => {
  const res = await axiosInstance.get(endpoints.auth.me);
  return res.data;
};

export const updateProfile = async (formData) => {
  const res = await axiosInstance.put(endpoints.auth.updateProfile, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ---------- SESSIONS ----------
export const getPublicSessions = async () => {
  const res = await axiosInstance.get(endpoints.sessions.public);
  return res.data;
};

export const getMySessions = async () => {
  const res = await axiosInstance.get(endpoints.sessions.my);
  return res.data;
};

export const getSessionById = async (id) => {
  const res = await axiosInstance.get(endpoints.sessions.single(id));
  return res.data;
};

export const saveDraftSession = async (sessionData) => {
  const res = await axiosInstance.post(
    endpoints.sessions.saveDraft,
    sessionData
  );
  return res.data;
};

export const publishSession = async (sessionData) => {
  const res = await axiosInstance.post(endpoints.sessions.publish, sessionData);
  return res.data;
};

// single public session
export const getPublicSessionById = async (id) => {
  const res = await axiosInstance.get(endpoints.sessions.publicSingle(id)); 
  return res.data;
};

export const deleteSession = async (id) => {
  const res = await axiosInstance.delete(endpoints.sessions.delete(id));
  return res.data;
};


