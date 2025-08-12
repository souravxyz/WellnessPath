import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "../../../hooks/auth/useAuthHooks";
import { getImageUrl } from "../../../utils/getImageUrl";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  useTheme,
  Fade,
} from "@mui/material";
import {
  CameraAlt,
  Save,
  ArrowBack,
  CheckCircle,
  CloudUpload,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";

export default function EditProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { myProfile, update } = useProfile();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    watch,
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [avatarColor, setAvatarColor] = useState(theme.palette.primary.main);
  const [success, setSuccess] = useState(false);
  const profilePic = watch("profilePic");

  // Handle image preview
  useEffect(() => {
    if (profilePic?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(profilePic[0]);
    } else {
      setPreviewImage(null);
    }
  }, [profilePic]);

  // Populate form when profile data is fetched
  useEffect(() => {
    if (myProfile.data) {
      setValue("name", myProfile.data.name);
      setValue("email", myProfile.data.email);
      setValue("bio", myProfile.data.bio || "");
      setAvatarColor(myProfile.data.avatarColor || theme.palette.primary.main);
    }
  }, [myProfile.data, setValue, theme]);

  const onSubmit = async (data) => {
    const updatedProfile = {
      ...myProfile.data,
      name: data.name,
      email: data.email,
      bio: data.bio || "",
      avatarColor,
      profilePic: previewImage || myProfile.data.profilePic,
    };

    myProfile.data = updatedProfile;

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("bio", data.bio || "");
    formData.append("avatarColor", avatarColor);
    if (data.profilePic?.[0]) {
      formData.append("profilePic", data.profilePic[0]);
    }

    try {
      await update.mutateAsync(formData);
    } catch (error) {
      console.error("Update failed:", error);
      // Rollback if needed
      myProfile.refetch();
    }
  };

  if (myProfile.isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );

  if (myProfile.isError)
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error.main" variant="h6">
          Failed to load profile
        </Typography>
        <Button
          onClick={() => myProfile.refetch()}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: "700px",
          mx: "auto",
          p: 3,
          background: "linear-gradient(145deg, #f5f7fa, #ffffff)",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              "&:hover": {
                transform: "translateX(-3px)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              background: "linear-gradient(90deg, #3f51b5, #2196f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Edit Your Profile
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Avatar Section with Floating Controls */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
              position: "relative",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{ position: "relative" }}
            >
              <Avatar
                src={
                  previewImage ||
                  (myProfile.data.profilePic
                    ? getImageUrl(myProfile.data.profilePic)
                    : null)
                }
                sx={{
                  width: 140,
                  height: 140,
                  fontSize: 60,
                  bgcolor: avatarColor,
                  border: "4px solid white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                {myProfile.data.name?.charAt(0).toUpperCase()}
              </Avatar>

              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: theme.palette.primary.main,
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  zIndex: 2,
                }}
              >
                <label htmlFor="profile-pic-upload">
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    {...register("profilePic")}
                  />
                  <CameraAlt sx={{ color: "white" }} />
                </label>
              </motion.div>
            </motion.div>

            <Button
              variant="text"
              size="small"
              onClick={() => setShowColorPicker(!showColorPicker)}
              sx={{
                mt: 1,
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {showColorPicker ? "Hide Color Picker" : "Change Avatar Color"}
            </Button>

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: "16px" }}
                >
                  <HexColorPicker
                    color={avatarColor}
                    onChange={setAvatarColor}
                    style={{ width: "100%" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Form Fields with Floating Labels */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              variant="filled"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{
                mb: 3,
                "& .MuiFilledInput-root": {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.7)",
                  "&:hover, &.Mui-focused": {
                    background: "rgba(255,255,255,0.9)",
                  },
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              variant="filled"
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
                "& .MuiFilledInput-root": {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.7)",
                  "&:hover, &.Mui-focused": {
                    background: "rgba(255,255,255,0.9)",
                  },
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <TextField
              fullWidth
              label="Bio"
              variant="filled"
              multiline
              minRows={3}
              maxRows={6}
              {...register("bio", {
                maxLength: {
                  value: 300,
                  message: "Bio cannot exceed 300 characters",
                },
              })}
              error={!!errors.bio}
              helperText={
                errors.bio?.message || "Write a short bio about yourself."
              }
              sx={{
                mt: 3,
                "& .MuiFilledInput-root": {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.7)",
                  "&:hover, &.Mui-focused": {
                    background: "rgba(255,255,255,0.9)",
                  },
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Box>

          {/* Action Buttons with Micro-interactions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              >
                Cancel
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: update.isLoading ? 1 : 1.03 }}
              whileTap={{ scale: update.isLoading ? 1 : 0.98 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={update.isLoading || !isDirty}
                startIcon={
                  update.isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : success ? (
                    <CheckCircle />
                  ) : (
                    <Save />
                  )
                }
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  background: success
                    ? "linear-gradient(90deg, #4CAF50, #8BC34A)"
                    : "linear-gradient(90deg, #3f51b5, #2196f3)",
                  boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(90deg, #e0e0e0, #bdbdbd)",
                  },
                }}
              >
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      Saved!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="save"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {update.isLoading ? "Saving..." : "Save Changes"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </Box>

          {/* File Upload Status */}
          {profilePic?.[0] && (
            <Fade in={!!profilePic?.[0]}>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  background: "rgba(33, 150, 243, 0.1)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CloudUpload color="primary" />
                <Typography variant="body2" color="text.secondary">
                  {profilePic[0].name} ready to upload
                </Typography>
              </Box>
            </Fade>
          )}
        </form>
      </Box>
    </motion.div>
  );
}
