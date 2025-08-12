import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/auth/useAuthHooks";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Register = () => {
  const { register: registerMutation } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    registerMutation.mutate({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
  };

  const passwordValue = watch("password");

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 1,
            }}
          >
            Join Wellness Journey
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start your path to better health and wellbeing
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 3 }}
        >
          {/* Name Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name should be at least 2 characters",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color={errors.name ? "error" : "action"} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color={errors.email ? "error" : "action"} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={errors.password ? "error" : "action"} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Retype your password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={errors.confirmPassword ? "error" : "action"} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            fullWidth
            variant="contained"
            disabled={isSubmitting || registerMutation.isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {registerMutation.isLoading || isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
