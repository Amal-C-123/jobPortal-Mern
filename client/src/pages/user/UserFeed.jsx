import React, { useContext, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import Feed from "../../components/user/Feed";
import FeedNav from "../../components/user/FeedNav";
import Rightbar from "../../components/user/Rightbar";
import Sidebar from "../../components/user/Sidebar";
import { GlobalContext } from "../../Context/Global";

const UserFeed = () => {
  const { socket } = useContext(GlobalContext);
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;

  //add new user
  useEffect(() => {
    // socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", userId);
  }, [userId]);

  return (
    <>
      <Box>
        <FeedNav />
        <Stack
          direction="row"
          spacing={2}
          width="90%"
          sx={{ mx: "auto" }}
          // justifyContent="space-between"
        >
          <Sidebar />
          <Feed />
          <Rightbar />
        </Stack>
      </Box>
    </>
  );
};

export default UserFeed;
