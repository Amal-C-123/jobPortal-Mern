import { Close, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../Context/Global";
import { getRequest, postRequest } from "../../helper/HandleRequest";

const BlueButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#4540DB",
  width: "20%",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "15px",
}));

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const BasicInfo = () => {
  const { loggedUser, setloggedUser } = useContext(GlobalContext);
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    yearsOfExperience: "",
    ctc: "",
    location: "",
  });

  useEffect(() => {
    getRequest(`/getUser/${userId}`).then((res) => {
      const { returnedValue } = res;
      const { age, yearsOfExperience, ctc, location } = returnedValue;
      setFormData((formData) => ({
        //functional update
        ...formData,
        age,
        yearsOfExperience,
        ctc,
        location,
      }));
    });
  }, [userId]);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let uId = loggedUser?._id;
    formData.userId = uId;
    formData.section = "basic-info";
    postRequest("/setProfile", formData).then((doc) => {
      setloggedUser(doc?.returnedValue);
      closeModal();
    });
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSaving(false);
  };

  return (
    <>
      <StyledPaper elevation={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" textAlign="start">
            Basic Information
          </Typography>
          <Edit sx={{ cursor: "pointer" }} onClick={() => openModal()} />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                padding: "0.2rem",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline" sx={{ fontSize: "1rem" }}>
                age
              </Typography>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {loggedUser?.age ? `${loggedUser.age} years` : ""}
              </p>
              <Divider
                fullwidth="true"
                sx={{ margin: "0.5rem 0", width: "80%" }}
              />
              <Typography variant="overline" sx={{ fontSize: "1rem" }}>
                CTC
              </Typography>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {loggedUser?.ctc ? `${loggedUser.ctc} Lacs` : ""}
              </p>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                padding: "0.2rem",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline" sx={{ fontSize: "1rem" }}>
                Years of experience
              </Typography>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {loggedUser?.yearsOfExperience
                  ? `${loggedUser.yearsOfExperience} Years`
                  : ""}
              </p>
              <Divider
                fullwidth="true"
                sx={{ margin: "0.5rem 0", width: "80%" }}
              />
              <Typography variant="overline" sx={{ fontSize: "1rem" }}>
                location
              </Typography>
              <p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                {loggedUser?.location ? loggedUser.location : ""}
              </p>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                padding: "0.2rem",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline" sx={{ fontSize: "1rem" }}>
                Phone
              </Typography>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {loggedUser?.mobile}
              </p>
              <Divider
                fullwidth="true"
                sx={{ margin: "0.5rem 0", width: "80%" }}
              />
              <Typography variant="overline" sx={{ fontSize: "1rem" }}>
                Email
              </Typography>
              <p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                {loggedUser?.email}
              </p>
            </Box>
          </Grid>
        </Grid>
        {/* <BlueButton size="medium" variant="contained" sx={{ margin: "0 1rem" }}>
          Upload Resume
        </BlueButton> */}
      </StyledPaper>
      <StyledModal open={open}>
        <Box
          bgcolor="white"
          px={2}
          py={1}
          borderRadius={5}
          sx={{ width: "30%", height: "auto", outline: "none" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="0.5rem"
          >
            <Typography variant="h6" color="gray" mx="auto">
              Basic Info
            </Typography>
            <Close sx={{ cursor: "pointer" }} onClick={closeModal} />
          </Box>
          <Divider fullwidth="true" />
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                padding: "1rem",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Box sx={{ display: "flex", gap: "2rem" }}>
                <TextField
                  size="small"
                  sx={{ width: "50%" }}
                  name="age"
                  type="number"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formData?.age}
                  label="Age"
                  variant="outlined"
                  required
                />
                <TextField
                  size="small"
                  sx={{ width: "100%" }}
                  name="yearsOfExperience"
                  type="number"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formData?.yearsOfExperience}
                  label="Years Of Experience"
                  variant="outlined"
                  required
                />
              </Box>
              <Box sx={{ display: "flex", gap: "2rem" }}>
                <TextField
                  size="small"
                  sx={{ width: "50%" }}
                  name="ctc"
                  type="number"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formData?.ctc}
                  label="CTC"
                  variant="outlined"
                  required
                />
                <TextField
                  size="small"
                  sx={{ width: "100%" }}
                  name="location"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={formData?.location}
                  label="Location"
                  variant="outlined"
                  required
                />
              </Box>
              <BlueButton type="submit" sx={{ mx: "auto" }}>
                {saving ? <CircularProgress size="1.5rem" /> : "Save"}
              </BlueButton>
            </Box>
          </form>
        </Box>
      </StyledModal>
    </>
  );
};

export default BasicInfo;
