import { Comment, Share, SoupKitchen, ThumbUp } from "@mui/icons-material";
import {
  Box,
  CardActions,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { GlobalContext } from "../../Context/Global";
import { postRequest } from "../../helper/HandleRequest";

const PostFunctions = ({ setLike, post, showComment }) => {
  let userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
  const { loggedUser, socket } = useContext(GlobalContext);

  let reqData = { userId, postId: post._id };
  let doPostLike = () => {
    postRequest("/like", reqData).then((res) => {
      if (res.success) {
        setLike((like) => !like);
        let socketData = {
          name: loggedUser?.name,
          pic: loggedUser?.profile_pic,
          action: "liked",
          time: Date.now(),
          postOwnerId: post?.userId?._id,
        };
        if (post?.userId?._id !== userId && res.returnedValue === "liked") {
          socket.current.emit("send-notifications", socketData);
        }
      }
    });
  };

  return (
    <>
      <CardActions
        sx={{
          display: "flex",
          mx: "auto",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              doPostLike();
            }}
          >
            {post.likes.includes(userId) ? (
              <Checkbox
                icon={<ThumbUp sx={{ color: "#1b81ff" }} />}
                checkedIcon={<ThumbUp sx={{ color: "#1b81ff" }} />}
              />
            ) : (
              <Checkbox icon={<ThumbUp />} checkedIcon={<ThumbUp />} />
            )}
          </IconButton>
          <Typography variant="body2">{post.likes.length} like</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              showComment((a) => !a);
            }}
          >
            <Comment sx={{ cursor: "pointer" }} />
          </IconButton>
          {post.comments.length > 0 ? (
            <Typography variant="body2">
              {post.comments.length} comment
            </Typography>
          ) : (
            <Typography variant="body2">comment</Typography>
          )}
        </Box>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>
    </>
  );
};

export default PostFunctions;
