import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Tooltip } from '@mui/material';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import { Palette, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "@uidotdev/usehooks";

export default function ColorPicker({ selectedColor, onColorChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  useClickAway(colorPickerRef, () => {
    setShowColorPicker(false);
  });

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title="Change accent color">
        <IconButton
          onClick={() => setShowColorPicker(!showColorPicker)}
          sx={{
            color: selectedColor,
            "&:hover": {
              transform: "scale(1.1)",
              transition: "transform 0.2s ease",
            },
          }}
        >
          <Palette />
        </IconButton>
      </Tooltip>

      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            ref={colorPickerRef}
            style={{
              position: isMobile ? "fixed" : "absolute",
              zIndex: 1300,
              top: isMobile ? "50%" : "40px",
              left: isMobile ? "50%" : "unset",
              right: isMobile ? "unset" : "0",
              transform: isMobile ? "translate(-50%, -50%)" : "unset",
              width: isMobile ? "70vw" : "auto",
              maxWidth: isMobile ? 250 : 300,
            }}
          >
            <Paper
              elevation={5}
              sx={{
                p: isMobile ? 1.5 : 2,
                borderRadius: isMobile ? 2 : 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2">Choose your color</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowColorPicker(false)}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <HexColorPicker
                color={selectedColor}
                onChange={onColorChange}
                style={{
                  width: "100%",
                  height: isMobile ? 150 : 200,
                }}
              />
              {isMobile && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setShowColorPicker(false)}
                  sx={{ mt: 2, background: selectedColor }}
                >
                  Done
                </Button>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}