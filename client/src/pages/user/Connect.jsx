import { Box, Stack } from "@mui/material";
import React, { useContext, useEffect } from "react";
import Connections from "../../components/user/Connections";
import FeedNav from "../../components/user/FeedNav";
import Rightbar from "../../components/user/Rightbar";
import Sidebar from "../../components/user/Sidebar";
import { GlobalContext } from "../../Context/Global";

const Connect = () => {
  const { socket } = useContext(GlobalContext);
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;

  useEffect(() => {
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
          <Connections />
          <Rightbar />
        </Stack>
      </Box>
    </>
  );
};

export default Connect;
