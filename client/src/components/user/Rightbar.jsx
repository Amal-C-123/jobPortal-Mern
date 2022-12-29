import { Box, Paper, styled, Typography, Avatar } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../Context/Global";
import { getRequest } from "../../helper/HandleRequest";

const ProBox = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
    justifyContent: "center",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.primary.main,
  padding: "0.8rem",
  borderRadius: "15px",
  marginTop: "3rem",
  width: "19.4rem",
}));

const Rightbar = () => {
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const { connected } = useContext(GlobalContext);
  const [connections, setConnections] = useState([]);
  useEffect(() => {
    getRequest(`/get-connections?userId=${userId}`).then((res) => {
      if (res.success) {
        setConnections(res.returnedValue);
      }
    });
  }, [userId, connected]);

  return (
    <ProBox flex={1.4}>
      <Box position="fixed">
        <StyledPaper elevation={8}>
          <Typography variant="h5" fontWeight={300} ml={1} mb={2}>
            Connections
          </Typography>

          <Box display="flex" width="90%" m={1}>
            <Box display="flex" flexDirection="column">
              {connections &&
                connections.map((user, index) => (
                  <Box
                    key={index}
                    ml={1}
                    mb={1}
                    display="flex"
                    alignItems="center"
                  >
                    <Link to={`/user/${user._id}`}>
                      <Avatar alt="Remy Sharp" src={user?.profile_pic} />
                    </Link>

                    <Link
                      to={`/user/${user._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography variant="body1" ml={2}>
                        {user?.name}
                      </Typography>
                    </Link>
                  </Box>
                ))}
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </ProBox>
  );
};

export default Rightbar;
