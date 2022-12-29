import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material/";
import Navbar from "../../components/user/Navbar";
import FormInput from "../../components/user/FormInput";
import { useLoginForm } from "../../Hooks/useLoginForm";
import { Link } from "react-router-dom";
import { postRequest } from "../../helper/HandleRequest";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.gray,
  padding: "0.8rem",
  borderRadius: "25px",
  width: "26rem",
}));

const BlueButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#4540DB",
  textTransform: "capitalize",
  width: "30%",
  margin: "0 auto",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const SAvatar = styled(Avatar)(({ theme }) => ({
  m: 1,
  backgroundColor: theme.palette.primary.blue,
}));

const doLogin = async (values) => {
  const route = "/login";
  const respData = await postRequest(route, values);
  return respData;
};

const Login = () => {
  const { handleChange, handleSubmit, errors, passErr, emailErr, fieldsErr } =
    useLoginForm(doLogin);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <StyledPaper elevation={8}>
          <Box
            mt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SAvatar sx={{ backgroundColor: "#4540D" }}>
              <LockOutlinedIcon />
            </SAvatar>
            <Typography variant="h6">Login</Typography>
            {fieldsErr && (
              <Alert sx={{ textTransform: "capitalize" }} severity="error">
                {fieldsErr}
              </Alert>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ width: "95%", m: 2.5 }}
              autoComplete="off"
            >
              <FormInput
                placeHolder="Enter your Email"
                label1="email"
                name="email"
                error={emailErr}
                helperText={emailErr && `${errors?.email}`}
                onChange={handleChange}
                type="text"
              />

              <FormInput
                placeHolder="Enter your Password"
                type="password"
                name="password"
                error={passErr}
                helperText={passErr && `${errors?.password}`}
                onChange={handleChange}
                label1="password"
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <BlueButton type="submit" size="medium" variant="contained">
                  Login
                </BlueButton>
                <Grid container mt={2} px={1}>
                  <Grid item xs>
                    <Link variant="body2">
                      <Typography
                        sx={{
                          color: "#4540DB",
                          fontSize: "0.9rem",
                          fontStyle: "italic",
                        }}
                      >
                        Login with otp
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup" variant="body2">
                      <Typography
                        sx={{
                          color: "#4540DB",
                          fontSize: "0.9rem",
                          fontStyle: "italic",
                        }}
                      >
                        "Don't have an account? Sign Up"
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </>
  );
};

export default Login;
