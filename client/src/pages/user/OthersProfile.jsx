import { Box, Stack } from "@mui/material";
import React from "react";
import FeedNav from "../../components/user/FeedNav";
import OtherUserProfile from "../../components/user/OtherUserProfile";
import Rightbar from "../../components/user/Rightbar";

const OthersProfile = () => {
  return (
    <>
      <Box>
        <FeedNav />
        <Stack
          direction="row"
          spacing={3}
          width="90%"
          sx={{ mx: "auto" }}
          // justifyContent="space-between"
        >
          <OtherUserProfile />
          <Rightbar />
        </Stack>
      </Box>
    </>
  );
};

export default OthersProfile;
