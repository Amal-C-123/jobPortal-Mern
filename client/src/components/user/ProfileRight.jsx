import { Box } from "@mui/material";
import React from "react";
import BasicInfo from "./BasicInfo";
import Experience from "./Experience";

const ProfileRight = () => {
  return (
    <Box flex={3}>
      <BasicInfo />
      <Experience />
    </Box>
  );
};

export default ProfileRight;
