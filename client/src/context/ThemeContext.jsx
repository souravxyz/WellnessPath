import { createContext, useState, useContext, useMemo, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import baseTheme from "../theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [accentColor, setAccentColor] = useState(() => {
    const savedColor = localStorage.getItem("accentColor");
    return savedColor || baseTheme.palette.primary.main;
  });

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
  }, [accentColor]);

  const theme = useMemo(() => {
    // Function to calculate contrast text color
    const getContrastText = (color) => {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? "#000000" : "#ffffff";
    };

    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        primary: {
          main: accentColor,
          contrastText: getContrastText(accentColor),
        },
        secondary: {
          main: accentColor,
          contrastText: getContrastText(accentColor),
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            contained: {
              background: `linear-gradient(90deg, ${accentColor}, #ddd)`,
              "&:hover": {
                opacity: 0.9,
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: "#ffffff",
            },
          },
        },
      },
    });
  }, [accentColor]);

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider
        value={{
          accentColor,
          setAccentColor,
          theme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
