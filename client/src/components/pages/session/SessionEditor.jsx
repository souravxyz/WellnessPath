import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useSingleSession,
  useSaveDraft,
  usePublish,
} from "../../../hooks/sessions/useSessions";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  useTheme,
  Tooltip,
  InputAdornment,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import {
  Save,
  Publish,
  ArrowBack,
  CheckCircle,
  Error,
  Schedule,
  Link as LinkIcon,
  AutoFixHigh,
  ContentCopy,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "@uidotdev/usehooks";

export default function SessionEditor() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  const { data: sessionData, isLoading, error } = useSingleSession(paramId);
  const saveDraft = useSaveDraft();
  const publish = usePublish();

  const [sessionId, setSessionId] = useState(paramId || null);
  const [form, setForm] = useState({
    title: "",
    tags: "",
    jsonUrl: "",
  });
  const [lastSavedForm, setLastSavedForm] = useState(form);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const [isDirty, setIsDirty] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const debounceRef = useRef(null);
  const formRef = useRef(null);
  const tagSuggestionsRef = useRef(null);
  const commonTags = [
    "meditation",
    "yoga",
    "breathwork",
    "mindfulness",
    "wellness",
    "fitness",
  ];

  useClickAway(tagSuggestionsRef, () => {
    setShowTagSuggestions(false);
  });

  // Load session data into form
  useEffect(() => {
    if (sessionData) {
      const updatedForm = {
        title: sessionData.title || "",
        tags: (sessionData.tags || []).join(", "),
        jsonUrl: sessionData.json_file_url || "",
      };
      setForm(updatedForm);
      setLastSavedForm(updatedForm);
      if (sessionData._id && sessionData._id !== sessionId) {
        setSessionId(sessionData._id);
      }
    }
  }, [sessionData, sessionId]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const formsAreEqual = (a, b) =>
    a.title === b.title && a.tags === b.tags && a.jsonUrl === b.jsonUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const newForm = { ...f, [name]: value };
      setIsDirty(!formsAreEqual(newForm, lastSavedForm));
      return newForm;
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!formsAreEqual(form, lastSavedForm)) {
        handleSaveDraft();
      }
    }, 3000);
  };

  const handleAddTag = (tag) => {
    const currentTags = form.tags
      ? form.tags.split(",").map((t) => t.trim())
      : [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(", ");
      setForm((f) => ({ ...f, tags: newTags }));
      setIsDirty(true);
    }
    setShowTagSuggestions(false);
  };

  const preparePayload = () => ({
    id: sessionId,
    title: form.title,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    json_file_url: form.jsonUrl,
  });

  const handleSaveDraft = async () => {
    if (formsAreEqual(form, lastSavedForm)) return;
    try {
      setSaveStatus({ type: "saving", message: "Saving draft..." });
      const savedSession = await saveDraft.mutateAsync(preparePayload());
      if (!sessionId && (savedSession._id || savedSession.id)) {
        setSessionId(savedSession._id || savedSession.id);
      }
      setLastSavedForm(form);
      setSaveStatus({ type: "saved", message: "Draft saved successfully" });
      setTimeout(() => setSaveStatus({ type: "", message: "" }), 2000);
    } catch {
      setSaveStatus({ type: "error", message: "Failed to save draft" });
    }
  };

  const handlePublish = async () => {
    if (!form.title.trim()) {
      setSaveStatus({
        type: "error",
        message: "Title is required before publishing",
      });
      return;
    }

    try {
      let idToPublish = sessionId;

      if (!idToPublish) {
        const savedSession = await saveDraft.mutateAsync(preparePayload());
        idToPublish = savedSession._id || savedSession.id;
        setSessionId(idToPublish);
      } else {
        await saveDraft.mutateAsync(preparePayload());
      }

      await publish.mutateAsync({ id: idToPublish });
      navigate("/my-sessions");
    } catch (err) {
      setSaveStatus({ type: "error", message: "Failed to publish session" });
      console.error("Publish error:", err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSaveStatus({ type: "saved", message: "Copied to clipboard!" });
    setTimeout(() => setSaveStatus({ type: "", message: "" }), 2000);
  };

  if (isLoading)
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Skeleton
          variant="rectangular"
          width={300}
          height={40}
          sx={{
            mb: 3,
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
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={56}
            sx={{
              mb: 2,
              borderRadius: 2,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
                  : "linear-gradient(90deg, #f5f5f5 0%, #e9e9e9 50%, #f5f5f5 100%)",
              backgroundSize: "200% 100%",
              animation: "wave 1.5s ease-in-out infinite",
            }}
          />
        ))}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Box>
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
          Failed to load session
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/my-sessions")}
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
          Back to Sessions
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 800,
        mx: "auto",
        position: "relative",
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, transparent 70%)`,
          zIndex: 0,
          opacity: 0.3,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${theme.palette.secondary.light}20 0%, transparent 70%)`,
          zIndex: 0,
          opacity: 0.2,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <motion.div
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/my-sessions")}
              sx={{
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
              Back to Sessions
            </Button>
          </motion.div>

          <AnimatePresence>
            {saveStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  severity={
                    saveStatus.type === "error"
                      ? "error"
                      : saveStatus.type === "saved"
                      ? "success"
                      : "info"
                  }
                  icon={
                    saveStatus.type === "error" ? (
                      <Error />
                    ) : saveStatus.type === "saved" ? (
                      <CheckCircle />
                    ) : (
                      <Schedule />
                    )
                  }
                  sx={{
                    maxWidth: 400,
                    alignItems: "center",
                    py: 0,
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  {saveStatus.message}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -0.5,
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
            {sessionId ? "Edit Wellness Session" : "Create New Session"}
          </Typography>

          <Box
            component="form"
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveDraft();
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Session Title"
              variant="outlined"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: `${theme.palette.primary.light}50`,
                  },
                  "&:hover fieldset": {
                    borderColor: `${theme.palette.primary.main}80`,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.light}30`,
                  },
                },
              }}
            />

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                variant="outlined"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                onFocus={() => setShowTagSuggestions(true)}
                helperText="Enter tags separated by commas, e.g. yoga, meditation, breathing"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Suggest tags">
                        <IconButton
                          onClick={() =>
                            setShowTagSuggestions(!showTagSuggestions)
                          }
                          edge="end"
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <AutoFixHigh />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: `${theme.palette.primary.light}50`,
                    },
                    "&:hover fieldset": {
                      borderColor: `${theme.palette.primary.main}80`,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.light}30`,
                    },
                  },
                }}
              />

              <AnimatePresence>
                {showTagSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    ref={tagSuggestionsRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1,
                      marginTop: 4,
                    }}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {commonTags.map((tag) => (
                        <motion.div
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip
                            label={tag}
                            size="small"
                            onClick={() => handleAddTag(tag)}
                            sx={{
                              background: `${theme.palette.primary.light}20`,
                              color: theme.palette.primary.dark,
                              fontWeight: 500,
                              "&:hover": {
                                background: `${theme.palette.primary.light}40`,
                              },
                            }}
                          />
                        </motion.div>
                      ))}
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            <TextField
              fullWidth
              label="JSON File URL"
              variant="outlined"
              name="jsonUrl"
              value={form.jsonUrl}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: form.jsonUrl && (
                  <InputAdornment position="end">
                    <Tooltip title="Copy URL">
                      <IconButton
                        onClick={() => copyToClipboard(form.jsonUrl)}
                        edge="end"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: `${theme.palette.primary.light}50`,
                  },
                  "&:hover fieldset": {
                    borderColor: `${theme.palette.primary.main}80`,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.light}30`,
                  },
                },
              }}
            />

            <Divider
              sx={{
                my: 2,
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
                height: 1,
                border: "none",
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Tooltip title={!isDirty ? "No changes to save" : ""}>
                <span>
                  <motion.div
                    whileHover={isDirty ? { scale: 1.05 } : {}}
                    whileTap={isDirty ? { scale: 0.95 } : {}}
                  >
                    <Button
                      variant="outlined"
                      startIcon={
                        saveStatus.type === "saving" ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Save />
                        )
                      }
                      onClick={handleSaveDraft}
                      disabled={saveDraft.isLoading || !isDirty}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        minWidth: 140,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          background: `${theme.palette.primary.light}10`,
                          borderColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Save Draft
                    </Button>
                  </motion.div>
                </span>
              </Tooltip>

              <motion.div
                whileHover={form.title.trim() ? { scale: 1.05 } : {}}
                whileTap={form.title.trim() ? { scale: 0.95 } : {}}
              >
                <Button
                  variant="contained"
                  startIcon={
                    publish.isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Publish />
                    )
                  }
                  onClick={handlePublish}
                  disabled={publish.isLoading || !form.title.trim()}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    minWidth: 140,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 4px 15px ${theme.palette.primary.light}40`,
                    "&:hover": {
                      boxShadow: `0 6px 20px ${theme.palette.primary.light}60`,
                      transform: form.title.trim()
                        ? "translateY(-2px)"
                        : "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Publish
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
