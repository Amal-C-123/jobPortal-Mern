import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../Context/Global";
import { getRequest, postRequest } from "../../helper/HandleRequest";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  ...theme.typography.body2,
  width: "80%",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const BlueButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#4540DB",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const Connections = () => {
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const [users, setUser] = useState([]);
  const { connected, setConnected } = useContext(GlobalContext);

  useEffect(() => {
    getRequest(`/getAllUsers?userId=${userId}`).then((res) => {
      if (res.success) {
        setUser(res.returnedValue);
      }
    });
  }, [userId, connected]);

  const connectUser = (connectId) => {
    postRequest("/connect-user", { userId, connectId }).then((res) => {
      if (res.success) {
        setConnected((a) => !a);
      }
    });
  };

  return (
    <>
      <Box flex={3} display="flex" flexDirection="column">
        <Box sx={{ marginTop: "5%" }}>
          <Grid container>
            {users &&
              users.map((user, index) => (
                <Grid
                  key={index}
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "0.2rem",
                    margin: "0.7rem 0",
                  }}
                >
                  <Item
                    elevation={3}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      mx: "auto",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Link to={`/user/${user._id}`}>
                      <Avatar
                        alt="Remy Sharp"
                        src={user?.profile_pic}
                        sx={{ width: 90, height: 90, mx: " auto" }}
                      />
                    </Link>
                    <Link
                      to="/user"
                      style={{ textDecoration: "none", color: "gray" }}
                    >
                      <Typography
                        variant="h6"
                        textAlign="center"
                        sx={{ fontSize: "1rem" }}
                      >
                        {user?.name}
                      </Typography>
                    </Link>

                    <p
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      {user?.designation ? user?.designation : "------"}
                    </p>

                    {user?.connections?.includes(userId) ? (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mx: "auto" }}
                        onClick={() => connectUser(user?._id)}
                      >
                        remove
                      </Button>
                    ) : (
                      <BlueButton
                        sx={{ mx: "auto" }}
                        size="small"
                        onClick={() => connectUser(user?._id)}
                      >
                        Connect
                      </BlueButton>
                    )}
                  </Item>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Connections;
