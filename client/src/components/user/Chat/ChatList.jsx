import { Box, Paper, styled, Typography } from "@mui/material";
import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import { getRequest } from "../../../helper/HandleRequest";
// import "../Chat/Chat.css";
import Conversation from "./Conversation";

const StyledPaper = styled(Paper)(() => ({
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "15px",
}));

const ChatList = ({ chats, setCurrentChat, checkOnlineStatus }) => {
  // const [chats, setChats] = useState([]);
  const userId = JSON.parse(localStorage.getItem("userInfo"))._id;

  // useEffect(() => {
  //   getRequest(`/chat/${userId}`).then((res) => {
  //     if (res.success) {
  //       setChats(res.returnedValue);
  //     }
  //   });
  // }, [userId]);

  return (
    <>
      <Box flex={1.8}>
        <StyledPaper elevation={3} sx={{ height: "32rem" }}>
          <div className="Left-side-chat">
            <Typography variant="h5" color="gray">
              Chats
            </Typography>
            <div className="Chat-List">
              {chats.map((chat, index) => (
                <Conversation
                  key={index}
                  data={chat}
                  currentUserId={userId}
                  online={checkOnlineStatus(chat)}
                  setCurrentChat={setCurrentChat}
                />
              ))}
            </div>
          </div>
        </StyledPaper>
      </Box>
    </>
  );
};

export default ChatList;
