import { useMySessions } from "../../../hooks/sessions/useSessions";
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Spa,
  Publish,
  Drafts,
  CalendarToday,
  SentimentDissatisfied,
  Add,
  Refresh,
  ArrowForward,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: sessions = [], isLoading, error, refetch } = useMySessions();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading)
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton
          variant="rectangular"
          width={200}
          height={40}
          sx={{
            mb: 4,
            borderRadius: 2,
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
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={120}
              sx={{
                borderRadius: 3,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
                    : "linear-gradient(90deg, #f5f5f5 0%, #e9e9e9 50%, #f5f5f5 100%)",
                backgroundSize: "200% 100%",
                animation: "wave 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </Stack>
      </Box>
    );

  if (error)
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
        }}
      >
        <Typography color="error.main" variant="h6" gutterBottom>
          Failed to load dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => refetch()}
          startIcon={<Refresh />}
          sx={{
            mt: 2,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            background: theme.palette.error.main,
            "&:hover": {
              background: theme.palette.error.dark,
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );

  // Calculate session statistics
  const publishedCount = sessions.filter(
    (s) => s.status === "published"
  ).length;
  const draftCount = sessions.filter((s) => s.status === "draft").length;
  const latestSession =
    sessions.length > 0
      ? sessions.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        )
      : null;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Decorative background elements */}
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

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 3, md: 4 },
            gap: 2,
            width: "100%",
          }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -0.5,
              position: "relative",
              lineHeight: 1.2,
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: "50%",
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                borderRadius: 2,
              },
            }}
          >
            Your Wellness Dashboard
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: isMobile ? "100%" : "auto" }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/my-sessions/new")}
              startIcon={<Add />}
              fullWidth={isMobile}
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 4px 15px ${theme.palette.primary.light}40`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${theme.palette.primary.light}60`,
                },
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                minWidth: isMobile ? "100%" : "auto",
              }}
            >
              New Session
            </Button>
          </motion.div>
        </Box>

        {/* Stats Overview */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: { xs: 2, sm: 3 },
            mb: { xs: 3, md: 4 },
            width: "100%",
          }}
        >
          <StatCard
            value={sessions.length}
            label="Total Sessions"
            icon={<Spa sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
          <StatCard
            value={publishedCount}
            label="Published"
            icon={<Publish sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
          />
          <StatCard
            value={draftCount}
            label="Drafts"
            icon={<Drafts sx={{ color: theme.palette.warning.main }} />}
            color={theme.palette.warning.main}
          />
        </Box>

        <Divider
          sx={{
            my: { xs: 3, md: 4 },
            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
            height: 1,
            border: "none",
          }}
        />

        {/* Latest Session */}
        {latestSession && (
          <Box sx={{ mb: { xs: 3, md: 4 }, width: "100%" }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Latest Session
            </Typography>
            <SessionCard
              session={latestSession}
              onClick={() => navigate(`/my-sessions/${latestSession._id}`)}
              isFeatured
            />
          </Box>
        )}

        {/* All Sessions Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: 1,
            width: "100%",
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
            Your Sessions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </Typography>
        </Box>

        {/* Sessions List */}
        <AnimatePresence>
          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: "100%" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  borderRadius: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  width: "100%",
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
                  <SentimentDissatisfied
                    sx={{
                      fontSize: 60,
                      color: theme.palette.text.secondary,
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                </motion.div>
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                  No sessions created yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Start your wellness journey by creating your first session
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/my-sessions/new")}
                  startIcon={<Add />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 4px 15px ${theme.palette.primary.light}40`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 20px ${theme.palette.primary.light}60`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Create First Session
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: { xs: 2, sm: 3 },
                width: "100%",
              }}
            >
              {sessions.map((session) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  style={{ width: "100%" }}
                >
                  <SessionCard
                    session={session}
                    onClick={() => navigate(`/my-sessions/${session._id}`)}
                  />
                </motion.div>
              ))}
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

// Stat Card Component
const StatCard = ({ value, label, icon, color }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <motion.div whileHover={{ y: -3 }} style={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 3,
          borderRadius: 3,
          background: `${color}10`,
          border: `1px solid ${color}20`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: `0 8px 24px ${color}15`,
            borderColor: `${color}40`,
          },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: isMobile ? 1 : 2,
              borderRadius: "50%",
              background: `${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${color}30`,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={700}
              noWrap
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};

// Session Card Component
const SessionCard = ({ session, onClick, isFeatured = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        cursor: "pointer",
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        background: isFeatured
          ? `${theme.palette.primary.light}08`
          : theme.palette.background.paper,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 8px 24px ${theme.palette.primary.light}20`,
          transform: isFeatured ? "none" : "translateY(-5px)",
        },
        ...(isFeatured && {
          border: `2px solid ${theme.palette.primary.light}`,
          boxShadow: `0 4px 20px ${theme.palette.primary.light}15`,
        }),
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            component="h3"
            sx={{
              fontWeight: 600,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              background: isFeatured
                ? `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                : "none",
              WebkitBackgroundClip: isFeatured ? "text" : "none",
              WebkitTextFillColor: isFeatured ? "transparent" : "none",
            }}
          >
            {session.title || "Untitled Session"}
          </Typography>

          {isFeatured && (
            <Chip
              label="Latest"
              size="small"
              sx={{
                background: `${theme.palette.primary.light}30`,
                color: theme.palette.primary.dark,
                fontWeight: 500,
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Chip
            label={session.status || "draft"}
            size="small"
            icon={
              session.status === "published" ? (
                <Publish fontSize="small" />
              ) : (
                <Drafts fontSize="small" />
              )
            }
            sx={{
              background:
                session.status === "published"
                  ? `${theme.palette.success.light}30`
                  : `${theme.palette.warning.light}30`,
              color:
                session.status === "published"
                  ? theme.palette.success.dark
                  : theme.palette.warning.dark,
              border:
                session.status === "published"
                  ? `1px solid ${theme.palette.success.light}`
                  : `1px solid ${theme.palette.warning.light}`,
              fontWeight: 500,
            }}
          />

          {session.createdAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: "auto",
                flexShrink: 0,
              }}
            >
              <CalendarToday
                fontSize="small"
                sx={{ opacity: 0.7, fontSize: "14px" }}
              />
              {new Date(session.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Click to {session.status === "published" ? "view" : "edit"}
          </Typography>
          <ArrowForward
            fontSize="small"
            sx={{
              color: theme.palette.primary.main,
              opacity: 0.7,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
