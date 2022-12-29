import React, { useContext, useEffect } from "react";
import "./FeedNav.css";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  TextField,
  Toolbar,
  Typography,
  Button,
  Popover,
} from "@mui/material";
import noAvatar from "../../images/avatar.png";
import {
  HomeRounded,
  MailRounded,
  NotificationsRounded,
  PeopleAlt,
  SearchOutlined,
  WorkRounded,
} from "@mui/icons-material/";
import { GlobalContext } from "../../Context/Global";
import { format } from "timeago.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useRef } from "react";
import { useState } from "react";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  width: "85%",
  margin: "0 auto",
});

const Search = styled(TextField)(({ theme }) => ({
  backgroundColor: "white",
  display: "none",
  // padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "65%",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  // justifyContent: "space-between",
  gap: "0.5rem",
  [theme.breakpoints.up("xs")]: {
    display: "flex",
    gap: "0.5rem",
  },
  [theme.breakpoints.up("sm")]: {
    display: "flex",
    gap: "1.5rem",
  },
  [theme.breakpoints.up("md")]: {
    display: "flex",
    gap: "2rem",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    color: "white ",
    backgroundColor: theme.palette.primary.blue,
  },
}));

const SIcon = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    color: "#666697",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // gap: "10px",
  // [theme.breakpoints.up("sm")]: {
  //   display: "none",
  // },
}));

function FeedNav() {
  const { loggedUser, setloggedUser, socket } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState([]);
  const notifCount = useRef(0);
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const notif = Boolean(notifAnchorEl);
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  useEffect(() => {
    socket.current.on("receive-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      notifCount.current += 1;
    });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
    setNotifications([]);
    notifCount.current = 0;
  };

  const handleNotifClick = (event) => {
    if (notifCount.current > 0) {
      setNotifAnchorEl(event.currentTarget);
    }
  };

  const doLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    socket.current.emit("logout", userId);
    setloggedUser("");
    navigate("/");
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#F5F5F5", color: "black" }}>
        <StyledToolbar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "none", sm: "1.4rem" },
                display: { xs: "none", sm: "block" },
              }}
            >
              Job<span style={{ color: "#4540DB" }}>Wiser</span>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "0.9rem" },
                textAlign: "center",
                display: { xs: "block", sm: "none" },
              }}
            >
              Job
              <span style={{ color: "#4540DB" }}>
                <br /> Wiser
              </span>
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={0}
            sx={{
              width: "80%",
              alignItems: "center",
            }}
          >
            <Box flex={2}>
              <form>
                <Search
                  fullWidth
                  variant="outlined"
                  label="Search..."
                  size="small"
                  defaultValue=""
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit" aria-label="search">
                        <SearchOutlined style={{ fill: "#4540DB" }} />
                      </IconButton>
                    ),
                  }}
                />
              </form>
            </Box>

            <Icons flex={0.9}>
              <Link to="/feed" color="#0000">
                <SIcon>
                  <HomeRounded
                    className={splitLocation[1] === "feed" ? "active" : ""}
                    sx={{
                      width: "auto",
                      height: "2rem",
                    }}
                  />
                </SIcon>
              </Link>

              <Link to="/connect" color="#0000">
                <SIcon>
                  <PeopleAlt
                    className={splitLocation[1] === "connect" ? "active" : ""}
                    sx={{ width: "auto", height: "2rem" }}
                  />
                </SIcon>
              </Link>

              {/* <Link to="/jobs" color="#0000">
                <SIcon>
                  <WorkRounded
                    className={splitLocation[1] === "jobs" ? "active" : ""}
                    sx={{ width: "auto", height: "2rem" }}
                  />
                </SIcon>
              </Link> */}

              {/* <StyledBadge badgeContent={3}> */}
              <Link to="/messages" color="#0000">
                <SIcon>
                  <MailRounded
                    className={splitLocation[1] === "messages" ? "active" : ""}
                    sx={{ width: "auto", height: "2rem" }}
                  />
                </SIcon>
              </Link>
              {/* </StyledBadge> */}

              <StyledBadge badgeContent={notifCount.current} color="success">
                <SIcon onClick={handleNotifClick}>
                  <NotificationsRounded
                    sx={{ width: "auto", height: "2rem" }}
                  />
                </SIcon>
              </StyledBadge>

              <UserBox>
                <Button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <Avatar
                    sx={{ width: 30, height: 30 }}
                    src={
                      loggedUser?.profile_pic
                        ? loggedUser?.profile_pic
                        : noAvatar
                    }
                  />
                </Button>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 155, left: 1390 }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <Link to="/profile" style={{ textDecoration: "none" }}>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={doLogout}>Logout</MenuItem>
                </Menu>

                <Typography
                  textAlign="center"
                  sx={{ fontSize: "0.77rem" }}
                  variant="span"
                >
                  {loggedUser?.name}
                </Typography>
              </UserBox>
            </Icons>
          </Stack>
        </StyledToolbar>
      </AppBar>
      <div>
        <Popover
          open={notif}
          anchorEl={notifAnchorEl}
          onClose={handleNotifClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 400, left: 1230 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              height: "20rem",
              width: "24rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
            p={1}
          >
            {notifications.map((elem, i) => (
              <Box
                key={i}
                sx={{ display: "flex", gap: "0.4rem", alignItems: "center" }}
                p={1}
              >
                <Avatar src={elem?.pic} />
                <Typography>{elem?.name}</Typography>
                <Typography>{elem?.action} your post</Typography>
                <Typography>{format(elem?.time)}</Typography>
              </Box>
            ))}
          </Box>
        </Popover>
      </div>
    </>
  );
}

export default FeedNav;
