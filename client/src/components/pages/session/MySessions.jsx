import { useNavigate } from "react-router-dom";
import {
  useDeleteSession,
  useMySessions,
} from "../../../hooks/sessions/useSessions";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Skeleton,
  Card,
  CardActionArea,
  IconButton,
  Paper,
  Avatar,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  Spa,
  Publish,
  Drafts,
  ArrowForward,
  Close,
  Circle,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useState } from "react";
import ConfirmDialog from "../../layouts/ConfirmDialog";
import { useThemeContext } from "../../../context/ThemeContext";

export default function MySessions() {
  const theme = useTheme();
  const { accentColor } = useThemeContext();
  const navigate = useNavigate();
  const { data: sessions, isLoading, error } = useMySessions();
  const deleteMutation = useDeleteSession();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(sessionToDelete._id || sessionToDelete.id);
    setConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  if (isLoading)
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton
          variant="rectangular"
          width={200}
          height={40}
          sx={{ mb: 3 }}
        />
        <Skeleton
          variant="rectangular"
          width={150}
          height={36}
          sx={{ mb: 4 }}
        />
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error.main" variant="h6" gutterBottom>
          Failed to load your sessions
        </Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
        position: "relative",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight={800}
          sx={{
            background: `linear-gradient(90deg, ${accentColor}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Wellness Journey
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/my-sessions/new")}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            background: `linear-gradient(90deg, ${accentColor}, ${theme.palette.secondary.main})`,
            boxShadow: `0 4px 15px ${accentColor}33`,
            "&:hover": {
              boxShadow: `0 6px 20px ${accentColor}4D`,
            },
          }}
        >
          New Session
        </Button>
      </Box>

      {/* Session List */}
      {sessions?.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: theme.palette.background.paper,
            border: `1px dashed ${accentColor}`,
          }}
        >
          <Spa
            sx={{
              fontSize: 60,
              color: accentColor,
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography variant="h5" gutterBottom>
            Your wellness canvas is empty
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Begin painting your journey with meaningful sessions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/my-sessions/new")}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              background: `linear-gradient(90deg, ${accentColor}, ${theme.palette.secondary.main})`,
            }}
          >
            Create First Session
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {sessions.map((session) => (
            <motion.div
              key={session._id || session.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${accentColor}20`,
                  background: theme.palette.background.paper,
                  boxShadow: `0 2px 12px ${accentColor}10`,
                  "&:hover": {
                    boxShadow: `0 4px 16px ${accentColor}20`,
                    borderColor: `${accentColor}40`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() =>
                    navigate(`/my-sessions/${session._id || session.id}`)
                  }
                  sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      fontWeight={600}
                      sx={{ mb: 1 }}
                    >
                      {session.title || "Untitled Session"}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
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
                              ? `${accentColor}20`
                              : `${theme.palette.warning.light}20`,
                          color:
                            session.status === "published"
                              ? accentColor
                              : theme.palette.warning.main,
                          border:
                            session.status === "published"
                              ? `1px solid ${accentColor}`
                              : `1px solid ${theme.palette.warning.main}`,
                        }}
                      />
                      {session.createdAt && (
                        <Typography variant="body2" color="text.secondary">
                          <Circle
                            sx={{
                              fontSize: 8,
                              verticalAlign: "middle",
                              mx: 1,
                              color: accentColor,
                            }}
                          />
                          {new Date(session.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArrowForward sx={{ color: accentColor }} />

                    <Tooltip title="Delete session">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(session);
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardActionArea>
              </Card>
            </motion.div>
          ))}
        </Stack>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Session?"
        content={`Are you sure you want to delete "${sessionToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
}
