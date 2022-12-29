import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../Context/Global";
import { getRequest, postRequest } from "../../helper/HandleRequest";

const OtherUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const loggedUserId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const [user, setUser] = useState({});
  const { connected, setConnected, setChatMembers } = useContext(GlobalContext);

  useEffect(() => {
    getRequest(`/getUser/${userId}`).then((res) => {
      const { returnedValue } = res;
      setUser(returnedValue);
    });
  }, [userId, connected]);

  const connectUser = (connectId) => {
    postRequest("/connect-user", { userId: loggedUserId, connectId }).then(
      (res) => {
        if (res.success) {
          setConnected((a) => !a);
        }
      }
    );
  };

  const messageUser = () => {
    const createChat = { senderId: loggedUserId, receiverId: userId };
    setChatMembers(createChat); //for fetching users message directly.. 
    postRequest("/chat", createChat).then((res) => {
      navigate("/messages");
    });
  };

  return (
    <>
      <Box flex={4} display="flex" flexDirection="column">
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            marginTop: "5%",
            width: "82%",
            marginLeft: "18%",
            flexDirection: "column",
          }}
        >
          <Box>
            <Stack direction="row" spacing={2}>
              <Box flex={1} p={2}>
                <Avatar
                  sx={{
                    mx: "auto",
                    width: 120,
                    height: 120,
                    marginBottom: "0.5rem",
                  }}
                  src={user?.profile_pic}
                />
                <Typography variant="h6" textAlign="center" color="gray">
                  {user?.name}
                </Typography>
              </Box>
              <Box
                flex={2}
                p={2}
                sx={{
                  display: "flex",
                  gap: "1.5rem",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {user?.designation ? (
                  <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ fontSize: "1rem", textTransform: "capitalize" }}
                  >
                    Working as {user.designation}
                  </Typography>
                ) : (
                  ""
                )}

                <Box sx={{ display: "flex", gap: "2rem" }}>
                  {user?.connections?.includes(loggedUserId) ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        color: "white",
                        backgroundColor: "#4540DB",
                        "&:hover": {
                          backgroundColor: "red",
                        },
                      }}
                      onClick={() => connectUser(user?._id)}
                    >
                      remove connection
                    </Button>
                  ) : (
                    <Button
                      onClick={() => connectUser(user?._id)}
                      variant="contained"
                      size="small"
                      sx={{
                        width: "7rem",
                        color: "white",
                        backgroundColor: "#4540DB",
                        "&:hover": {
                          backgroundColor: "#413AFD",
                        },
                      }}
                    >
                      Connect
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      width: "7rem",
                      color: "black",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                    onClick={() => messageUser()}
                  >
                    Message
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Box>
          <Divider fullwidth="true" />
          <Box p={2} sx={{ width: "80%", mx: "auto" }}>
            <Typography variant="body1" sx={{ fontWeight: "800" }}>
              About
            </Typography>
            <Typography
              variant="caption"
              textAlign="center"
              sx={{ fontSize: "0.9rem" }}
            >
              {user?.about}
            </Typography>
          </Box>
          <Divider fullwidth="true" />
          <Box p={2} sx={{ width: "80%", mx: "auto" }}>
            <Typography variant="body1" sx={{ fontWeight: "800" }}>
              Skills
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {user?.skills?.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  variant="outlined"
                  sx={{
                    margin: "0.2rem 0.3rem",
                    color: "blue",
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider fullwidth="true" />
          <Box p={2} sx={{ width: "80%", mx: "auto" }}>
            <Typography variant="body1" sx={{ fontWeight: "800" }}>
              Experience
            </Typography>
            {user?.experience?.map((exp, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  marginTop: "0.3rem",
                }}
              >
                <Typography
                  variant=""
                  sx={{ marginLeft: "1.5rem", fontWeight: "400" }}
                >
                  {exp?.designation}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: "2.5rem",
                    fontSize: "0.8rem",
                    fontWeight: "400",
                  }}
                >
                  {exp?.companyName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: "2.5rem",
                    fontSize: "0.8rem",
                    fontWeight: "400",
                  }}
                >
                  {exp?.timeSpan}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider fullwidth="true" />
          <Box p={2} sx={{ width: "80%", mx: "auto" }}>
            <Typography variant="body1" sx={{ fontWeight: "800" }}>
              Education
            </Typography>
            {user?.education?.map((edu, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  marginTop: "0.3rem",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ marginLeft: "1.5rem", fontWeight: "400" }}
                >
                  {edu?.university}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: "2.5rem",
                    fontSize: "0.8rem",
                    fontWeight: "400",
                  }}
                >
                  {edu?.course}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: "2.5rem",
                    fontSize: "0.8rem",
                    fontWeight: "400",
                  }}
                >
                  {edu?.timeSpan}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider fullwidth="true" />
        </Paper>
      </Box>
    </>
  );
};

export default OtherUserProfile;
