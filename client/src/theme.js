import { createTheme } from "@mui/material/styles";
// Base theme configuration
const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // Default primary color
    },
    secondary: {
      main: "#f50057", // Default secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8, // Default border radius
  },
});

export default baseTheme;
