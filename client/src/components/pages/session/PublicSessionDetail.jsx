import React from "react";
import { useParams } from "react-router-dom";
import { useSinglePublicSession } from "../../../hooks/sessions/useSessions";
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Stack,
  Avatar,
  Divider,
  Button,
  Link,
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Person,
  Description,
  Spa,
  FavoriteBorder,
  Favorite,
  Share,
  OpenInNew,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/getImageUrl";

const PublicSessionDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();
  const { data, isLoading, isError } = useSinglePublicSession(id);
  const [isLiked, setIsLiked] = React.useState(false);

  if (isLoading)
    return (
      <Box
        sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto", width: "100%" }}
      >
        <Skeleton
          variant="rectangular"
          width={isMobile ? 200 : 300}
          height={40}
          sx={{ mb: 3, borderRadius: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width={isMobile ? 150 : 200}
          height={30}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box>
            <Skeleton width={120} height={24} sx={{ mb: 1 }} />
            <Skeleton width={180} height={20} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              width={60}
              height={32}
              sx={{ borderRadius: 16 }}
            />
          ))}
        </Box>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={100}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width={isMobile ? "100%" : 150}
          height={40}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    );

  if (isError)
    return (
      <Box
        textAlign="center"
        p={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        <Typography color="error.main" variant="h6" gutterBottom>
          Failed to load session details
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            px: 3,
            py: 1,
            borderRadius: 2,
            background: theme.palette.error.main,
            "&:hover": {
              background: theme.palette.error.dark,
            },
            width: isMobile ? "100%" : "auto",
          }}
        >
          Retry
        </Button>
      </Box>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Decorative background elements - adjusted for mobile */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: -50, md: -100 },
            right: { xs: -50, md: -100 },
            width: { xs: 200, md: 300 },
            height: { xs: 200, md: 300 },
            background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, transparent 70%)`,
            zIndex: 0,
            opacity: 0.3,
            display: { xs: "none", sm: "block" },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: -30, md: -50 },
            left: { xs: -30, md: -50 },
            width: { xs: 150, md: 200 },
            height: { xs: 150, md: 200 },
            background: `radial-gradient(circle, ${theme.palette.secondary.light}20 0%, transparent 70%)`,
            zIndex: 0,
            opacity: 0.2,
            display: { xs: "none", sm: "block" },
          }}
        />

        <motion.div
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ width: isMobile ? "100%" : "auto" }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            fullWidth={isMobile}
            sx={{
              mb: 3,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              background: theme.palette.background.default,
              "&:hover": {
                background: theme.palette.action.hover,
              },
            }}
          >
            Back to sessions
          </Button>
        </motion.div>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 4,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            position: "relative",
            zIndex: 1,
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-start" },
              gap: 2,
              mb: 1,
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 8,
                  left: 0,
                  width: "60%",
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                  borderRadius: 2,
                },
              }}
            >
              {data?.title || "Untitled Session"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignSelf: { xs: "flex-start", sm: "flex-start" },
              }}
            >
              <Tooltip title={isLiked ? "Unlike" : "Like"}>
                <IconButton
                  onClick={() => setIsLiked(!isLiked)}
                  sx={{
                    color: isLiked
                      ? theme.palette.error.main
                      : theme.palette.text.secondary,
                    "&:hover": {
                      background: isLiked
                        ? `${theme.palette.error.light}20`
                        : `${theme.palette.primary.light}20`,
                    },
                  }}
                >
                  {isLiked ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Share">
                <IconButton
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      background: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": {
                  "& .author-name": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiAvatar-root": {
                    transform: "scale(1.05)",
                    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                  },
                },
              }}
            >
              <Avatar
                src={getImageUrl(data?.user_id?.profilePic)}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  border: `2px solid ${theme.palette.primary.light}`,
                }}
              >
                {data?.user_id?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  className="author-name"
                  sx={{
                    transition: "color 0.2s ease",
                  }}
                >
                  {data?.user_id?.name || "Anonymous"}
                </Typography>
                {data?.createdAt && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <CalendarToday
                      sx={{
                        fontSize: 14,
                        opacity: 0.8,
                      }}
                    />
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>

          {data?.tags?.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 4, flexWrap: "wrap", gap: 1 }}
            >
              {data.tags.map((tag, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={tag}
                    size="small"
                    sx={{
                      background: `${theme.palette.primary.light}30`,
                      color: theme.palette.primary.dark,
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.primary.light}`,
                      "&:hover": {
                        background: `${theme.palette.primary.light}50`,
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          )}

          {data?.description && (
            <>
              <Divider
                sx={{
                  my: 3,
                  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
                  height: 1,
                  border: "none",
                }}
              />
              <Typography
                variant="body1"
                paragraph
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  color: theme.palette.text.primary,
                }}
              >
                {data.description}
              </Typography>
            </>
          )}

          {data?.json_file_url && (
            <Box sx={{ mt: 4, width: "100%" }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Button
                  component={Link}
                  href={data.json_file_url}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  fullWidth={isMobile}
                  startIcon={<Description />}
                  endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    "&:hover": {
                      boxShadow: `0 4px 15px ${theme.palette.primary.light}80`,
                    },
                  }}
                >
                  View Session Data
                </Button>
              </motion.div>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 6,
              mb: 2,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "linear",
              }}
            >
              <Spa
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  opacity: 0.2,
                }}
              />
            </motion.div>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default PublicSessionDetail;
