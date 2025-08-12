import React from "react";
import { useForm } from "react-hook-form";
import { usePassword } from "../../../hooks/auth/useAuthHooks";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Alert,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  LockReset,
  ArrowBack,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams();
  const { reset } = usePassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = React.useState({
    new: false,
    confirm: false,
  });

  const handleClickShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      return; // Validation will handle this
    }

    reset.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setTimeout(() => navigate("/login"), 2000);
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <LockReset
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Reset Password
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Create a new password for your account
            </Typography>
          </Box>

          {reset.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {reset.error.response?.data?.message ||
                "Password reset failed. The link may have expired."}
            </Alert>
          )}

          {reset.isSuccess ? (
            <Alert
              severity="success"
              icon={<CheckCircle fontSize="inherit" />}
              sx={{ mb: 3 }}
            >
              Password reset successful! Redirecting to login...
            </Alert>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
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
                        onClick={() => handleClickShowPassword("new")}
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
                        onClick={() => handleClickShowPassword("confirm")}
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

              <Button
                type="submit"
                variant="contained"
                disabled={reset.isLoading}
                startIcon={
                  reset.isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LockReset />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {reset.isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </motion.div>
  );
}
