import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Modal,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Edit, Send } from "@mui/icons-material/";
import React, { useContext, useEffect, useState } from "react";
import noAvatar from "../../images/avatar.png";
import { GlobalContext } from "../../Context/Global";
import { useRef } from "react";
import { getRequest, postRequest } from "../../helper/HandleRequest";

const StyledPaper = styled(Paper)(() => ({
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "15px",
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

const checkFile = (type) => {
  switch (type) {
    case "image/png":
      return true;
    case "image/jpg":
      return true;
    case "image/webp":
      return true;
    case "image/jpeg":
      return true;
    default:
      return false;
  }
};

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ProfileLeft = () => {
  const { loggedUser, setloggedUser } = useContext(GlobalContext);
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    designation: "",
    about: "",
  });
  const [skillArr, setSkillArr] = useState([]);
  const [image, setImage] = useState("");
  const skill = useRef(null);

  useEffect(() => {
    getRequest(`/getUser/${userId}`).then((res) => {
      const { returnedValue } = res;
      setFormData((formData) => ({
        //functional update
        ...formData,
        about: returnedValue.about,
        designation: returnedValue.designation,
      }));
      setSkillArr(returnedValue?.skills);
      setImage(returnedValue?.profile_pic);
    });
    console.log("rendering prof left");
  }, [userId, loggedUser]);

  function previewFiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  }
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    let checkImg = checkFile(file.type);
    if (file && checkImg) {
      previewFiles(file);
    }
  };
  const addSkill = () => {
    if (skill.current.value !== "") {
      setSkillArr([...skillArr, skill.current.value]);
      skill.current.value = "";
    }
  };
  const deleteSkill = (index) => {
    skillArr.splice(index, 1);
    setSkillArr([...skillArr]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    let uId = loggedUser?._id;
    formData.userId = uId;
    formData.skills = skillArr;
    formData.profile_pic = image;
    formData.section = "profile-left";
    postRequest("/setProfile", formData).then((doc) => {
      setloggedUser(doc?.returnedValue);
      handleClose();
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSaving(false);
  };

  return (
    <>
      <Box flex={1}>
        <StyledPaper elevation={3}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Edit sx={{ cursor: "pointer" }} onClick={() => setOpen(true)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <Avatar
              alt="Remy Sharp"
              src={loggedUser?.profile_pic ? loggedUser?.profile_pic : noAvatar}
              sx={{ width: 120, height: 120, mx: " auto" }}
            />
            <Box>
              <Typography variant="h6" textAlign="center">
                {loggedUser?.name}
              </Typography>
              <Box sx={{ width: "85%", mx: "auto" }}>
                <p style={{ textAlign: "center", textTransform: "uppercase" }}>
                  {loggedUser?.designation
                    ? loggedUser?.designation
                    : "designation:"}
                </p>

                <p
                  style={{
                    wordBreak: "break-all",
                    color: "GrayText",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    textAlign: "center",
                    marginTop: "1.5rem",
                  }}
                >
                  {loggedUser?.designation ? loggedUser?.about : "About:"}
                </p>
              </Box>
            </Box>

            <Box p={1}>
              <Typography
                variant="h6"
                textAlign="start"
                sx={{ fontSize: "1rem" }}
              >
                Skills
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {loggedUser?.designation
                  ? loggedUser?.skills.map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        variant="outlined"
                        sx={{
                          margin: "0.2rem",
                          color: "blue",
                        }}
                      />
                    ))
                  : ""}

                {/*  */}
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
      <StyledModal
        open={open}
        // onClose={(e) => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          bgcolor="white"
          px={2}
          py={1}
          borderRadius={5}
          sx={{ width: "35%", minHeight: "30%", outline: "none" }}
        >
          <Close
            sx={{ cursor: "pointer", float: "right" }}
            onClick={handleClose}
          />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={7}>
                <TextField
                  style={{ width: "100%", margin: "5px" }}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  type="text"
                  name="designation"
                  label="Designation"
                  variant="outlined"
                  value={formData?.designation}
                  required
                />
              </Grid>
              <Grid item xs={5} display="flex" justifyContent="center">
                <Box display="flex" alignItems="center">
                  <Avatar
                    flex={1}
                    alt="Remy Sharp"
                    src={image ? image : noAvatar}
                    sx={{
                      width: 70,
                      height: 70,
                      mx: " auto",
                    }}
                  />
                  <Box component="label" size="small">
                    <Edit
                      sx={{
                        fontSize: "1rem",
                        margin: "0 0.5rem",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/jfif"
                      onChange={handleProfilePic}
                      hidden
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%", margin: "5px" }}
                  id="standard-multiline-static"
                  multiline
                  rows={3}
                  placeholder="About........"
                  variant="standard"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="about"
                  value={formData?.about}
                  required
                />

                <Box
                  sx={{
                    width: "90%",
                    mx: "auto",
                    marginTop: "1rem",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6} display="flex" alignItems="center">
                      <TextField
                        style={{ width: "100%" }}
                        type="text"
                        inputRef={skill}
                        label="Skills"
                        placeholder="Add Skills"
                        variant="outlined"
                      />
                      <Send
                        sx={{ margin: "0 0.3rem", cursor: "pointer" }}
                        onClick={addSkill}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          gap: "0.4rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {skillArr.length > 0
                          ? skillArr.map((skill, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Chip label={skill} />
                                <Close
                                  sx={{
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    color: "red",
                                  }}
                                  onClick={() => deleteSkill(index)}
                                />
                              </div>
                            ))
                          : ""}
                      </Box>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "0.8rem 0",
                    }}
                  >
                    <BlueButton type="submit" size="medium" variant="contained">
                      {saving ? <CircularProgress size="1.5rem" /> : "Save"}
                    </BlueButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </StyledModal>
    </>
  );
};

export default ProfileLeft;
