import { AddCircle, Close, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  Modal,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useContext } from "react";
import Swal from "sweetalert2";
import { GlobalContext } from "../../Context/Global";
import { getRequest, postRequest } from "../../helper/HandleRequest";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "15px",
  marginTop: "1rem",
}));

const BlueButton = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "#4540DB",
  width: "20%",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  marginBottom: "9rem",
  justifyContent: "center",
});

const Experience = () => {
  const { loggedUser, setloggedUser } = useContext(GlobalContext);
  let uId = loggedUser?._id;
  const [saving, setSaving] = useState(false);
  const [expModal, setExperienceModal] = useState(false);
  const [eduModal, setEducationModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    timeSpan: "",
  });
  const [education, setEducation] = useState({
    university: "",
    course: "",
    timeSpan: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEducationInput = (e) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    formData.section = "experience";
    formData.userId = uId;
    if (!editModal) {
      postRequest("/setProfile", formData).then((resp) => {
        setloggedUser(resp.returnedValue);
        closeExpModal();
      });
    } else {
      let expId = localStorage.getItem("expId");
      formData.expId = expId;
      postRequest("/edit-experience", formData).then((doc) => {
        setloggedUser(doc.returnedValue);
        closeExpModal();
        localStorage.removeItem("expId");
      });
    }
  };

  const submitEducation = (e) => {
    e.preventDefault();
    setSaving(true);
    education.section = "education";
    education.userId = uId;
    if (!editModal) {
      postRequest("/setProfile", education).then((resp) => {
        setloggedUser(resp.returnedValue);
        closeEduModal();
      });
    } else {
      let eduId = localStorage.getItem("eduId");
      education.eduId = eduId;
      postRequest("/edit-education", education).then((doc) => {
        setloggedUser(doc.returnedValue);
        closeEduModal();
        localStorage.removeItem("eduId");
      });
    }
  };

  const editExperience = (experience) => {
    setEditModal(true);
    setExperienceModal(true);
    setFormData((formData) => ({
      //functional update
      ...formData,
      companyName: experience.companyName,
      designation: experience.designation,
      timeSpan: experience.timeSpan,
    }));
    localStorage.setItem("expId", experience.expId);
  };

  const editEducation = (data) => {
    setEditModal(true);
    setEducationModal(true);
    setEducation((education) => ({
      //functional update
      ...education,
      university: data.university,
      course: data.course,
      timeSpan: data.timeSpan,
    }));
    localStorage.setItem("eduId", data.eduId);
  };

  const delExperience = (id) => {
    Swal.fire({
      text: "Are you sure you want to Remove?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        getRequest(`/delete-experience?expId=${id}&userId=${uId}`).then(
          (doc) => {
            setloggedUser(doc.returnedValue);
          }
        );
      }
    });
  };
  const delEducation = (id) => {
    Swal.fire({
      text: "Are you sure you want to Remove?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        getRequest(`/delete-education?eduId=${id}&userId=${uId}`).then(
          (doc) => {
            setloggedUser(doc.returnedValue);
          }
        );
      }
    });
  };

  const closeExpModal = () => {
    setExperienceModal(false);
    setFormData({
      companyName: "",
      designation: "",
      timeSpan: "",
    });
    setSaving(false);
    setEditModal(false);
  };
  const closeEduModal = () => {
    setEducationModal(false);
    setEducation({
      university: "",
      course: "",
      timeSpan: "",
    });
    setSaving(false);
    setEditModal(false);
  };

  return (
    <>
      <StyledPaper elevation={3}>
        <Stack direction="row" spacing={3}>
          <Box flex={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" textAlign="start">
                Experience
              </Typography>
              <AddCircle
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setExperienceModal(true);
                }}
              />
            </Box>

            {loggedUser?.experience?.map((exp, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  // mx: "auto",
                  alignItems: "center",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    textAlign="start"
                    sx={{
                      fontSize: "1.1rem",
                      textTransform: "capitalize",
                      color: "#4540DB",
                    }}
                  >
                    {exp.companyName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {exp.designation}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {exp.timeSpan}
                  </Typography>
                  <Divider fullwidth="true" />
                </List>
                <Box sx={{ display: "flex", gap: "0.5rem" }}>
                  <Edit
                    sx={{ cursor: "pointer", fontSize: "1rem" }}
                    onClick={() => editExperience(exp)}
                  />
                  <Delete
                    sx={{ cursor: "pointer", fontSize: "1rem", color: "red" }}
                    onClick={() => {
                      delExperience(exp.expId);
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box flex={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" textAlign="start">
                Education
              </Typography>
              <AddCircle
                sx={{ cursor: "pointer" }}
                onClick={() => setEducationModal(true)}
              />
            </Box>
            {loggedUser?.education.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  // mx: "auto",
                  alignItems: "center",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    textAlign="start"
                    sx={{
                      fontSize: "1.1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.university}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.course}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.timeSpan}
                  </Typography>
                  <Divider fullwidth="true" />
                </List>
                <Box sx={{ display: "flex", gap: "0.5rem" }}>
                  <Edit
                    sx={{ cursor: "pointer", fontSize: "1rem" }}
                    onClick={() => editEducation(item)}
                  />
                  <Delete
                    sx={{ cursor: "pointer", fontSize: "1rem", color: "red" }}
                    onClick={() => delEducation(item?.eduId)}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </StyledPaper>
      <StyledModal open={expModal}>
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
              {editModal ? "Edit Experience" : "Add Experience"}
            </Typography>
            <Close sx={{ cursor: "pointer" }} onClick={closeExpModal} />
          </Box>
          <Divider fullwidth="true" />
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                padding: "1rem",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <TextField
                size="small"
                sx={{ width: "100%" }}
                name="companyName"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                value={formData?.companyName}
                label="Company Name"
                variant="outlined"
                required
              />
              <TextField
                size="small"
                name="designation"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                sx={{ width: "100%" }}
                label="Designation"
                value={formData?.designation}
                variant="outlined"
                required
              />
              <TextField
                size="small"
                sx={{ width: "100%" }}
                name="timeSpan"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                label="TimeSpan"
                value={formData?.timeSpan}
                variant="outlined"
                required
              />
              <BlueButton type="submit" sx={{ mx: "auto" }}>
                {saving ? <CircularProgress size="1.5rem" /> : "Save"}
              </BlueButton>
            </Box>
          </form>
        </Box>
      </StyledModal>

      {/*  Education modal...............*/}

      <StyledModal open={eduModal}>
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
              {editModal ? "Edit Education" : "Add Education"}
            </Typography>
            <Close sx={{ cursor: "pointer" }} onClick={closeEduModal} />
          </Box>
          <Divider fullwidth="true" />
          <form onSubmit={submitEducation}>
            <Box
              sx={{
                display: "flex",
                padding: "1rem",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <TextField
                size="small"
                sx={{ width: "100%" }}
                name="university"
                onChange={(e) => {
                  handleEducationInput(e);
                }}
                label="University / Board"
                value={education.university}
                variant="outlined"
                required
              />
              <TextField
                size="small"
                name="course"
                onChange={(e) => {
                  handleEducationInput(e);
                }}
                sx={{ width: "100%" }}
                label="Course Name"
                value={education.course}
                variant="outlined"
                required
              />
              <TextField
                size="small"
                sx={{ width: "100%" }}
                name="timeSpan"
                onChange={(e) => {
                  handleEducationInput(e);
                }}
                label="TimeSpan"
                value={education.timeSpan}
                variant="outlined"
                required
              />

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

export default Experience;
