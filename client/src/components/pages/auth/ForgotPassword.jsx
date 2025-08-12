import React from "react";
import { useForm } from "react-hook-form";
import { usePassword } from "../../../hooks/auth/useAuthHooks";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Paper,
  Alert,
  useTheme
} from "@mui/material";
import { 
  LockReset,
  ArrowBack,
  CheckCircle
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { forgot } = usePassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const onSubmit = (data) => {
    forgot.mutate({ email: data.email });
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
            Back to login
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
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              Forgot Password
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Enter your email and we'll send you a link to reset your password
            </Typography>
          </Box>

          {forgot.isSuccess ? (
            <Alert
              severity="success"
              icon={<CheckCircle fontSize="inherit" />}
              sx={{ mb: 3 }}
            >
              Password reset link sent! Please check your email.
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
                label="Email Address"
                variant="outlined"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={forgot.isLoading}
                startIcon={
                  forgot.isLoading ? (
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
                {forgot.isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Box>
          )}

          {forgot.isError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {forgot.error.response?.data?.message || "Failed to send reset link"}
            </Alert>
          )}
        </Paper>
      </Box>
    </motion.div>
  );
}