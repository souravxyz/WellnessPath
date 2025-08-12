import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useProfile } from "../../hooks/auth/useAuthHooks";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Spa,
  AccountCircle,
  LockReset,
  ExitToApp,
  Explore,
  DirectionsRun,
  Assessment,
  Person,
  Login,
  FitnessCenter,
  DashboardCustomize,
  Public,
  Menu as MenuIcon,
  Notifications,
  Palette,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ColorPicker from "../../components/layouts/ColorPicker";
import { useThemeContext } from "../../context/ThemeContext";

export default function Navbar() {
  const theme = useTheme();
  const { accentColor, setAccentColor } = useThemeContext();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { logout } = useAuth();
  const { myProfile } = useProfile();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const open = Boolean(anchorEl);

  const user = myProfile?.data;
  const avatarUrl = user?.profilePic ? getImageUrl(user.profilePic) : null;

  const handleMenuOpen = (event) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    if (path !== "/" && !user) {
      navigate("/login");
      return;
    }
    navigate(path);
    handleMenuClose();
    handleDrawerClose();
  };

  const handleLogout = () => {
    logout.mutate();
    handleMenuClose();
    handleDrawerClose();
    setLogoutConfirmOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    const paths = [
      "/",
      "/my-sessions",
      "/dashboard",
      user ? "/profile" : "/login",
    ];
    handleNavigation(paths[newValue]);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.default,
      }}
    >
      {/* Drawer Header */}
      <Box
        component={motion.div}
        whileTap={{ scale: 0.98 }}
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
          handleDrawerClose();
        }}
      >
        <Spa
          sx={{
            fontSize: 32,
            color: accentColor,
            transform: "rotate(-15deg)",
          }}
        />
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            background: `linear-gradient(90deg, ${accentColor}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          WellnessPath
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        <List>
          {[
            { icon: <Public />, text: "Public Sessions", path: "/" },
            {
              icon: <FitnessCenter />,
              text: "My Sessions",
              path: "/my-sessions",
            },
            {
              icon: <DashboardCustomize />,
              text: "Dashboard",
              path: "/dashboard",
            },
          ].map((item) => (
            <motion.div key={item.text} whileHover={{ scale: 1.02 }}>
              <ListItem
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    background: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: accentColor }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>

        {user && (
          <>
            <Divider sx={{ my: 2 }} />
            <List>
              {[
                { icon: <AccountCircle />, text: "Profile", path: "/profile" },
                {
                  icon: <LockReset />,
                  text: "Change Password",
                  path: "/change-password",
                },
              ].map((item) => (
                <motion.div key={item.text} whileHover={{ scale: 1.02 }}>
                  <ListItem
                    button
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&:hover": {
                        background: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: accentColor }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.02 }}>
                <ListItem
                  button
                  onClick={() => setLogoutConfirmOpen(true)}
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      background: theme.palette.error.light,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: 40, color: theme.palette.error.main }}
                  >
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      color: theme.palette.error.main,
                      fontWeight: 600,
                    }}
                  />
                </ListItem>
              </motion.div>
            </List>
          </>
        )}
      </Box>

      {user && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar
            src={avatarUrl}
            alt={user.name}
            sx={{
              width: 48,
              height: 48,
              bgcolor: accentColor,
              border: "2px solid white",
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          px: { xs: 2, md: 4 },
          py: 1,
          background: theme.palette.background.paper,
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.appBar,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Side - Logo and Mobile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}

            <Box
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Spa
                sx={{
                  fontSize: { xs: 28, md: 32 },
                  color: accentColor,
                  transform: "rotate(-15deg)",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${accentColor}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: { xs: "none", sm: "block" },
                }}
              >
                WellnessPath
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <Public />, text: "Public Sessions", path: "/" },
                {
                  icon: <FitnessCenter />,
                  text: "My Sessions",
                  path: "/my-sessions",
                },
                {
                  icon: <DashboardCustomize />,
                  text: "Dashboard",
                  path: "/dashboard",
                },
              ].map((item) => (
                <motion.div key={item.text} whileHover={{ scale: 1.05 }}>
                  <Button
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    {item.text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          {/* Right Side - User/Auth */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <Tooltip title="Notifications">
                  <IconButton>
                    <Badge badgeContent={4} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <ColorPicker
                  selectedColor={accentColor}
                  onColorChange={setAccentColor}
                />

                <Tooltip title="Account settings">
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      src={avatarUrl}
                      alt={user.name}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: accentColor,
                        border: "2px solid white",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      overflow: "visible",
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  {[
                    {
                      icon: <AccountCircle />,
                      text: "Profile",
                      path: "/profile",
                    },
                    {
                      icon: <LockReset />,
                      text: "Change Password",
                      path: "/change-password",
                    },
                  ].map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={() => {
                        handleNavigation(item.path);
                        handleMenuClose();
                      }}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemIcon sx={{ color: accentColor }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography fontWeight={500}>{item.text}</Typography>
                      </ListItemText>
                    </MenuItem>
                  ))}

                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={() => {
                      setLogoutConfirmOpen(true);
                      handleMenuClose();
                    }}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.error.main }}>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography color="error" fontWeight={500}>
                        Logout
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    background: `linear-gradient(90deg, ${accentColor}, ${theme.palette.secondary.main})`,
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 320,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation
          value={bottomNavValue}
          onChange={handleBottomNavChange}
          showLabels
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <BottomNavigationAction label="Public" icon={<Explore />} />
          <BottomNavigationAction
            label="My Sessions"
            icon={<DirectionsRun />}
          />
          <BottomNavigationAction label="Dashboard" icon={<Assessment />} />
          <BottomNavigationAction
            label={user ? "Profile" : "Login"}
            icon={user ? <Person /> : <Login />}
          />
        </BottomNavigation>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
