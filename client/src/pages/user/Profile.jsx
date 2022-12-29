import { Box, Stack } from "@mui/material";
import React from "react";
import FeedNav from "../../components/user/FeedNav";
import ProfileLeft from "../../components/user/ProfileLeft";
import ProfileRight from "../../components/user/ProfileRight";

const Profile = () => {
  return (
    <>
      <Box>
        <FeedNav />
        <Stack direction="row" mt={6} spacing={3} width="85%" sx={{ mx: "auto" }}>
          <ProfileLeft />
          <ProfileRight />
        </Stack>
      </Box>
    </>
  );
};

export default Profile;
