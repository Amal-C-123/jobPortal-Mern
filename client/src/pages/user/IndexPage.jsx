import React from "react";
import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import Navbar from "../../components/user/Navbar";
import hero from "../../images/workingConcept.jpg";

const IndexPage = () => {
  return (
    <>
      <Navbar />
      <Box
        mt={5}
        sx={{
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            height: "70%",
            width: "85%",
            display: "flex",
            // flexWrap: "wrap",
          }}
          spacing={1}
          direction="row"
          justifyContent="space-between"
        >
          <Box
            sx={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{textAlign:'center'}}>
              <Typography
                mt={2}
                sx={{ color: "#385A64", fontSize: 50, fontWeight: "bold" }}
              >
                Get The{"  "}
                <span style={{ color: "#4540DB" }}>Right Job</span> <br />
                You Deserve
              </Typography>
              <Typography variant="h5">786  jobs  &  110  candidates  are  registered</Typography>
            </Box>
          </Box>
          <Box>
            <Card sx={{ maxWidth: 500 }} elevation={3}>
              <CardMedia component="img" height="500" image={hero} alt="hero" />
            </Card>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default IndexPage;
