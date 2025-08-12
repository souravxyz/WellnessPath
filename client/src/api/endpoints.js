const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    changePassword: "/auth/change-password",
    resetPasswordWithToken: (token) => `/auth/reset-password/${token}`,
    me: "/auth/me",
    updateProfile: "/auth/update-profile",
  },

  sessions: {
    // Public sessions
    public: "/sessions", // GET all published
    publicSingle: (id) => `/sessions/${id}`, 

    // Private sessions (require login)
    my: "/my-sessions",
    single: (id) => `/my-sessions/${id}`,
    saveDraft: "/my-sessions/save-draft",
    publish: "/my-sessions/publish",
     delete: (id) => `/my-sessions/${id}`,
  },
};

export default endpoints;
