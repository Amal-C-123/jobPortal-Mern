import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Close, PhotoSizeSelectActual, Send } from "@mui/icons-material/";
import React, { useContext } from "react";
import { useState } from "react";
import noAvatar from "../../images/avatar.png";
import { postRequest } from "../../helper/HandleRequest";
import { GlobalContext } from "../../Context/Global";

const SBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.gray,
  margin: "auto",
  marginTop: "3rem",
  height: "4.5rem",
  width: "90%",
  borderRadius: "10px",
}));

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
  marginTop: "20px",
});

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  marginBottom: "9rem",
  justifyContent: "center",
});

const AddPost = ({ setRender }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const { loggedUser } = useContext(GlobalContext);

  function previewFiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  }

  function checkFile(file) {
    let fileStr = file.split(",");
    let extension;
    switch (fileStr[0]) {
      case "data:image/jpeg;base64":
        extension = "jpeg";
        break;
      case "data:image/png;base64":
        extension = "png";
        break;
      case "data:image/webp;base64":
        extension = "webp";
        break;
      default:
        extension = "other";
        break;
    }
    if (extension === "other") {
      return false;
    } else {
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    setImgErr("");
    const { _id, name } = loggedUser;
    let InputFile = checkFile(image);
    if (InputFile) {
      postRequest("/posts", {
        _id,
        name,
        postContent: content,
        image,
        date: new Date().toDateString(),
      }).then((res) => {
        setImage("");
        if (res.success) {
          setRender((a) => !a);
          setPosting(false);
          setOpen(false);
          setContent("");
        } else {
          setPosting(false);
          setOpen(false);
        }
      });
    } else {
      setImgErr("Please choose an image in jpeg, png or webp format");
      setPosting(false);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file);
  };

  return (
    <>
      <SBox elevation={8}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          pl={2}
          pr={2}
          height="100%"
        >
          <Avatar
            flex={1}
            alt="Remy Sharp"
            src={loggedUser?.profile_pic ? loggedUser?.profile_pic : noAvatar}
            sx={{ width: 40, height: 40, mx: " auto", mb: 1, mt: 1 }}
          />
          <Box
            onClick={(e) => setOpen(true)}
            color="black"
            flex={2}
            display="flex"
            sx={{
              color: "black",
              width: "100%",
              alignItems: "center",
              backgroundColor: "white",
              height: "2.5rem",
              cursor: "pointer",
              borderRadius: "24rem",
              border: "1px solid #808080",
            }}
          >
            <Typography variant="body2" ml={2}>
              Start a Post
            </Typography>
          </Box>
        </Stack>

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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="gray" mx="auto">
                Create A Post
              </Typography>
              <Close
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  setOpen(false);
                  setImage("");
                  setContent("");
                  setPosting(false);
                  setImgErr("");
                }}
              />
            </Box>

            <Divider />
            {imgErr && (
              <Typography textAlign="center" color="red">
                {imgErr}
              </Typography>
            )}
            <UserBox>
              <Avatar
                src={
                  loggedUser?.profile_pic ? loggedUser?.profile_pic : noAvatar
                }
                sx={{ width: 30, height: 30 }}
              />
              <Typography fontWeight={500} variant="span">
                {loggedUser?.name}
              </Typography>
            </UserBox>

            <form onSubmit={handleSubmit}>
              <TextField
                sx={{ width: "100%" }}
                id="standard-multiline-static"
                multiline
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="What's on your mind?"
                variant="standard"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "90%",
                  mx: "auto",
                  marginTop: "0.5rem",
                }}
              >
                <Button component="label">
                  <PhotoSizeSelectActual />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/jfif"
                    onChange={handleChange}
                    hidden
                  />
                </Button>
                {posting && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Typography fontWeight={500} variant="span">
                      Posting....
                    </Typography>
                    <CircularProgress size="1.5rem" />
                  </Box>
                )}

                <Button type="submit">
                  <Send sx={{ color: "blue" }} />
                </Button>
              </Box>
              {image && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img
                    style={{ width: "50%", height: "50%" }}
                    src={image}
                    alt=""
                  />
                </Box>
              )}
            </form>
          </Box>
        </StyledModal>
      </SBox>
    </>
  );
};

export default AddPost;
