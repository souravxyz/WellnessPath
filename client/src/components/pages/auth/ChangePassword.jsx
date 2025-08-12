import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePassword } from "../../../hooks/auth/useAuthHooks";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset,
  ArrowBack,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function ChangePassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { change } = usePassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    setError(null);
    change.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Change Password
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {change.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {change.error.response?.data?.message ||
                  "Failed to change password"}
              </Alert>
            )}

            {change.isSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Password changed successfully!
              </Alert>
            )}

            <TextField
              fullWidth
              label="Current Password"
              variant="outlined"
              type={showPassword.current ? "text" : "password"}
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("current")}
                      edge="end"
                    >
                      {showPassword.current ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              variant="outlined"
              type={showPassword.new ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("new")}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              variant="outlined"
              type={showPassword.confirm ? "text" : "password"}
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirm")}
                      edge="end"
                    >
                      {showPassword.confirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  px: 4,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={change.isLoading || !isDirty}
                startIcon={
                  <AnimatePresence mode="wait">
                    {change.isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CircularProgress size={20} color="inherit" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <LockReset />
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
                sx={{
                  px: 4,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {change.isLoading ? "Updating..." : "Change Password"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}
