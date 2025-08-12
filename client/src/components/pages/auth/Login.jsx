import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/auth/useAuthHooks";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Spa,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data) => {
    login.mutate({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
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
          <Spa
            color="primary"
            sx={{
              fontSize: 60,
              mb: 2,
              transform: "rotate(-15deg)",
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Continue your wellness journey
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 3 }}
        >
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

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || login.isLoading}
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
            {login.isLoading || isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              New to Wellness?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/register"
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Create Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
