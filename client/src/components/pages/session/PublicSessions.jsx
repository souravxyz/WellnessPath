import React from "react";
import { useState } from "react";
import { usePublicSessions } from "../../../hooks/sessions/useSessions";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Stack,
  Avatar,
  Card,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
  Button,
  Divider,
} from "@mui/material";
import {
  Spa,
  CalendarToday,
  Person,
  Description,
  ArrowForward,
  Search,
  Clear,
  FavoriteBorder,
  Favorite,
  Share,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getImageUrl } from "../../../utils/getImageUrl";
import { useThemeContext } from "../../../context/ThemeContext";

const PublicSessions = () => {
  const theme = useTheme();
  const { accentColor } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, isLoading, isError } = usePublicSessions();
  const [searchTerm, setSearchTerm] = useState("");
  const [likedSessions, setLikedSessions] = useState({});

  const filteredSessions = data?.filter((session) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.title?.toLowerCase().includes(searchLower) ||
      session.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      session.user_id?.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleLike = (sessionId) => {
    setLikedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  if (isError)
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error.main" variant="h6">
          Failed to load sessions
        </Typography>
      </Box>
    );

  if (!isLoading && !data?.length)
    return (
      <Box
        textAlign="center"
        p={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
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
              fontSize: 80,
              color: accentColor,
              mb: 2,
              opacity: 0.8,
            }}
          />
        </motion.div>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          No published sessions yet
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 500, mb: 3 }}
        >
          Be the first to share your wellness journey with the community
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${accentColor}, ${theme.palette.secondary.main})`,
            color: "white",
            borderRadius: 50,
            px: 4,
            py: 1.5,
            boxShadow: `0 4px 15px ${accentColor}33`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 6px 20px ${accentColor}66`,
            },
            transition: "all 0.3s ease",
          }}
        >
          Create Session
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, position: "relative" }}>
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          zIndex: 0,
          opacity: 0.3,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          zIndex: 0,
          opacity: 0.2,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${accentColor}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "50%",
              height: 4,
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              borderRadius: 2,
            },
          }}
        >
          Community Wellness
        </Typography>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TextField
            variant="outlined"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                background: theme.palette.background.paper,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                "& fieldset": {
                  borderColor: `${accentColor}40`,
                },
                "&:hover fieldset": {
                  borderColor: `${accentColor}80`,
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentColor,
                  boxShadow: `0 0 0 2px ${accentColor}20`,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: accentColor }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm("")}
                  sx={{ visibility: searchTerm ? "visible" : "hidden" }}
                >
                  <Clear fontSize="small" sx={{ color: accentColor }} />
                </IconButton>
              ),
            }}
          />
        </motion.div>
      </Box>

      {/* Session List */}
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            position: "relative",
            zIndex: 1,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={280}
              sx={{
                borderRadius: 3,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
                    : "linear-gradient(90deg, #f5f5f5 0%, #e9e9e9 50%, #f5f5f5 100%)",
                backgroundSize: "200% 100%",
                animation: "wave 1.5s ease-in-out infinite",
                "@keyframes wave": {
                  "0%": { backgroundPosition: "200% 0" },
                  "100%": { backgroundPosition: "-200% 0" },
                },
              }}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            position: "relative",
            zIndex: 1,
          }}
        >
          {filteredSessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",
                  background: theme.palette.background.paper,
                  "&:hover": {
                    boxShadow: `0 8px 30px ${accentColor}20`,
                    borderColor: `${accentColor}80`,
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  to={`/sessions/${session._id}`}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    p: 3,
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          minHeight: "3.5rem",
                          background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${accentColor})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {session.title || "Untitled Session"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          ml: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLike(session._id);
                          }}
                          sx={{
                            color: likedSessions[session._id]
                              ? accentColor
                              : theme.palette.text.secondary,
                            "&:hover": {
                              color: accentColor,
                            },
                          }}
                        >
                          {likedSessions[session._id] ? (
                            <Favorite fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: theme.palette.text.secondary,
                            "&:hover": {
                              color: accentColor,
                            },
                          }}
                        >
                          <Share fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {session.tags?.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                      >
                        {session.tags.map((tag, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Chip
                              label={tag}
                              size="small"
                              sx={{
                                background: `${accentColor}15`,
                                color: accentColor,
                                fontWeight: 500,
                                "&:hover": {
                                  background: `${accentColor}25`,
                                },
                              }}
                            />
                          </motion.div>
                        ))}
                      </Stack>
                    )}

                    <Divider
                      sx={{
                        my: 2,
                        borderColor: `${accentColor}20`,
                        borderBottomWidth: 1,
                      }}
                    />

                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          "&:hover": {
                            "& .author-name": {
                              color: accentColor,
                            },
                          },
                        }}
                      >
                        <Avatar
                          src={getImageUrl(session.user_id?.profilePic)}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: accentColor,
                            border: `2px solid ${accentColor}80`,
                          }}
                        >
                          {session.user_id?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="body2"
                          className="author-name"
                          sx={{
                            fontWeight: 500,
                            transition: "color 0.2s ease",
                          }}
                        >
                          {session.user_id?.name || "Anonymous"}
                        </Typography>
                      </Box>

                      {session.createdAt && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <CalendarToday
                            fontSize="small"
                            sx={{
                              color: accentColor,
                              opacity: 0.8,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {new Date(session.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                        </Box>
                      )}

                      {session.json_file_url && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Description
                            fontSize="small"
                            sx={{
                              color: accentColor,
                              opacity: 0.8,
                            }}
                          />
                          <Typography
                            variant="body2"
                            component="a"
                            href={session.json_file_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: accentColor,
                              textDecoration: "none",
                              fontSize: "0.8rem",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            View Session Data
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      mt: 3,
                    }}
                  >
                    <Chip
                      label={session.status || "Unknown"}
                      size="small"
                      sx={{
                        background:
                          session.status === "published"
                            ? `${accentColor}20`
                            : theme.palette.grey[300],
                        color:
                          session.status === "published"
                            ? accentColor
                            : theme.palette.text.secondary,
                        fontWeight: 500,
                        border:
                          session.status === "published"
                            ? `1px solid ${accentColor}40`
                            : undefined,
                      }}
                    />
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ArrowForward
                        sx={{
                          color: accentColor,
                          fontSize: 20,
                        }}
                      />
                    </motion.div>
                  </Box>
                </CardActionArea>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {!isLoading && searchTerm && filteredSessions.length === 0 && (
        <Box
          textAlign="center"
          p={4}
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <Search
              sx={{
                fontSize: 60,
                color: accentColor,
                mb: 2,
                opacity: 0.7,
              }}
            />
          </motion.div>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            No matching sessions found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search terms or browse all sessions
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSearchTerm("")}
            sx={{
              borderColor: accentColor,
              color: accentColor,
              "&:hover": {
                background: `${accentColor}10`,
                borderColor: accentColor,
              },
            }}
          >
            Clear Search
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PublicSessions;
