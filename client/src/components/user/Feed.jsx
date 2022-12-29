import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import { getRequest } from "../../helper/HandleRequest";
import AddPost from "./AddPost";
import Post from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [like, setLike] = useState(false);
  const [render, setRender] = useState(true);

  let getPost = async () => {
    let { returnedValue } = await getRequest("/feed");
    setPosts(returnedValue);
  };

  useEffect(() => {
    getPost();
    console.log("useffPost like->", like);
  }, [render, like]);

  return (
    <>
      <Box flex={3} display="flex" flexDirection="column">
        <AddPost setRender={setRender} />
        {posts &&
          posts.map((post) => (
            <Post key={post._id} post={post} like={like} setLike={setLike} />
          ))}
      </Box>
    </>
  );
};

export default Feed;
