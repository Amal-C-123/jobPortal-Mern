import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material/";
import Navbar from "../../components/user/Navbar";
import FormInput from "../../components/user/FormInput";
import { useForm } from "../../Hooks/useForm";
import { Link } from "react-router-dom";
import { postRequest } from "../../helper/HandleRequest";
import { useState } from "react";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.gray,
  padding: "1rem",
  borderRadius: "25px",
  width: "30rem",
}));

const BlueButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#4540DB",
  width: "30%",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const SAvatar = styled(Avatar)(({ theme }) => ({
  m: 1,
  backgroundColor: theme.palette.primary.blue,
}));

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const doSignUp = async (values) => {
    const route = "/signup";
    setLoading(true);
    const respData = await postRequest(route, values);
    if (respData) setLoading(false);
    return respData;
  };

  const { handleChange, errors, handleSubmit, confirmPasswordErr, fieldsErr } =
    useForm(doSignUp);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <StyledPaper elevation={8}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SAvatar sx={{ backgroundColor: "#4540D" }}>
              <LockOutlinedIcon />
            </SAvatar>
            <Typography variant="h6">Sign Up</Typography>
            {loading && (
              <Typography variant="h6" sx={{ color: "#413AFD" }}>
                Please wait...
                <CircularProgress size="1.4rem" sx={{ color: "#413AFD" }} />
              </Typography>
            )}  

            {fieldsErr && (
              <Alert sx={{ textTransform: "capitalize" }} severity="error">
                {fieldsErr}
              </Alert>
            )}
            <Box
              mt={1}
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ width: "95%" }}
              autoComplete="off"
            >
              <FormInput
                placeHolder="Enter your name"
                label1="name"
                name="name"
                error={errors.username ? true : false}
                helperText={
                  errors.username ? "Name atleast have 5 letters" : ""
                }
                onChange={handleChange}
                type="text"
              />
              <FormInput
                placeHolder="Enter your Email"
                label1="email"
                name="email"
                error={errors.email ? true : false}
                helperText={errors.email ? "Enter a valid email address" : ""}
                onChange={handleChange}
                type="text"
              />
              <FormInput
                placeHolder="Enter your Phone Number"
                type="number"
                name="mobile"
                error={errors.mobile ? true : false}
                helperText={
                  errors.mobile ? "number must contain 10 digits" : ""
                }
                onChange={handleChange}
                label1="Phone number"
              />
              <FormInput
                placeHolder="Enter your Password"
                type="password"
                name="password"
                error={errors.password ? true : false}
                helperText={
                  errors.password
                    ? "must include atleast 8 charaters & uppercase,lowercase and numbers"
                    : ""
                }
                onChange={handleChange}
                label1="password"
              />
              <FormInput
                placeHolder="Confirm Password"
                type="password"
                name="confirmPassword"
                error={confirmPasswordErr}
                helperText={confirmPasswordErr && "Password should match"}
                //
                onChange={handleChange}
                label1="confirm password"
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <BlueButton type="submit" size="medium" variant="contained">
                  SignUp
                </BlueButton>
              </Box>
              <Link to="/login" variant="body2">
                <Typography
                  mt={2}
                  sx={{
                    color: "#4540DB",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  "Already Have An Account? Sign In"
                </Typography>
              </Link>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </>
  );
};

export default SignUp;
