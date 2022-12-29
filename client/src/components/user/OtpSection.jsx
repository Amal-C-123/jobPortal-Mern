import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material/";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../../helper/HandleRequest";

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.gray,
  padding: "1.5rem",
  borderRadius: "25px",
  width: "26rem",
}));

const SAvatar = styled(Avatar)(({ theme }) => ({
  // m: 1,
  backgroundColor: theme.palette.primary.blue,
}));

const OtpSection = () => {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(60);
  const [otpErr, setOtpErr] = useState(false);
  const [errLabel, setErrLabel] = useState("");
  const navigate = useNavigate();
  const otp = useRef(null);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const validate = (otp) => {
    if (otp === "") {
      setErrLabel("please enter OTP");
      setOtpErr(true);
      return false;
    } else if (otp.length < 4 || otp.length > 4) {
      setErrLabel("otp must be 4 digits");
      setOtpErr(true);
      return false;
    } else {
      setErrLabel("");
      setOtpErr(false);
    }
    return true;
  };

  const resendOtp = () => {
    const email = JSON.parse(localStorage.getItem("tempUser")).email;
    setLoading(!loading);
    setErrLabel("");
    setOtpErr(false);
    otp.current.value = "";
    postRequest("/resend-otp", { email }).then((res) => {
      if (res.success) {
        setCounter(60);
        setLoading((a) => !a);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let otpValue = otp.current.value;
    const pass = validate(otpValue);
    if (pass) {
      let user = JSON.parse(localStorage.getItem("tempUser"));
      let reqObj = {
        ...user,
        otp: otpValue,
      };
      postRequest("/verify-otp", reqObj).then((res) => {
        if (res.success) {
          localStorage.removeItem("tempUser");
          navigate("/login");
          setErrLabel("");
          setOtpErr(false);
        } else {
          setOtpErr(true);
          setErrLabel("Please enter the correct OTP");
        }
      });
    }
  };

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
            component="form"
            onSubmit={handleSubmit}
            mt={2}
            sx={{
              display: "flex",
              gap: "0.8rem",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SAvatar sx={{ backgroundColor: "#4540D" }}>
              <LockOutlinedIcon />
            </SAvatar>
            <Typography variant="h6">
              Enter the OTP sent to your email
            </Typography>
            {loading && (
              <Typography variant="h6" sx={{ color: "#413AFD" }}>
                Please wait...
                <CircularProgress size="1.4rem" sx={{ color: "#413AFD" }} />
              </Typography>
            )}
            {otpErr && (
              <Alert
                sx={{ textTransform: "capitalize", margin: "0" }}
                p={0}
                severity="error"
              >
                {errLabel}
              </Alert>
            )}
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  error={otpErr}
                  label="OTP"
                  name="otp"
                  type="tel"
                  inputRef={otp}
                />
              </div>
            </Box>

            <Box sx={{ mx: "auto" }}>
              <Grid container>
                {counter === 0 ? (
                  <Grid item xs>
                    <Link variant="body2" onClick={resendOtp}>
                      <Typography
                        sx={{
                          color: "#4540DB",
                          fontSize: "0.9rem",
                          fontStyle: "italic",
                        }}
                      >
                        Resend OTP
                      </Typography>
                    </Link>
                  </Grid>
                ) : (
                  <Grid item xs>
                    <Typography
                      sx={{
                        color: "#4540DB",
                        fontSize: "0.9rem",
                        fontStyle: "italic",
                      }}
                    >
                      Resend otp in 00:
                      {counter}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
            <BlueButton size="medium" variant="contained" type="submit">
              submit
            </BlueButton>
          </Box>
        </StyledPaper>
      </Box>
    </>
  );
};

export default OtpSection;
