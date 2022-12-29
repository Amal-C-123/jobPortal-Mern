import { Avatar, Box, Button, Paper, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getRequest, postRequest } from "../../../helper/HandleRequest";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import "../Chat/Chat.css";
import { useRef } from "react";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "15px",
}));

const ChatBox = ({ chat, currentUser, setSendMessage, recievedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage !== "") {
      const message = {
        senderId: currentUser,
        text: newMessage,
        chatId: chat._id,
      };

      //send message to socket server
      const recieverId = chat.members.find((id) => id !== currentUser);
      setSendMessage({ ...message, recieverId });
      // send to database
      postRequest("/chat/message", message).then((data) => {
        setNewMessage("");
        setMessages([...messages, data.returnedValue]); //previous plus new message to the chat
      });
    }
  };

  useEffect(() => {
    const userId = chat?.members.find((id) => id !== currentUser);
    if (chat !== null) {
      getRequest(`/getUser/${userId}`).then((res) => {
        const { returnedValue } = res;
        setUserData(returnedValue);
      });
    }
  }, [chat, currentUser]);

  // fetching messages
  useEffect(() => {
    if (chat !== null) {
      getRequest(`/chat/message/${chat?._id}`).then((data) => {
        const { returnedValue } = data;
        setMessages(returnedValue);
      });
    }
  }, [chat]);

  //recieving messages frm socket
  useEffect(() => {
    if (recievedMessage !== null && recievedMessage?.chatId === chat?._id) {
      console.log("data recieved in child chatbos", recievedMessage);
      setMessages([...messages, recievedMessage]);
    }
  }, [recievedMessage]);

  //always scroll to the bottom
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Box flex={4}>
        <StyledPaper elevation={3} p={1} sx={{ height: "32rem" }}>
          <div className="ChatBox-container">
            {chat ? (
              <>
                <div>
                  <div className="chat-header">
                    <Avatar src={userData?.profile_pic} />
                    <div className="name" style={{ fontSize: "0.9rem" }}>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                        }}
                      >
                        {userData?.name}
                      </span>
                    </div>
                  </div>
                  <hr
                    style={{
                      width: "98%",
                      border: "0.1px solid #ececec",
                      margin: "0 auto",
                    }}
                  />
                </div>

                <div className="chat-body">
                  {messages.map((message, i) => (
                    <div
                      ref={scroll}
                      key={i}
                      className={
                        message.senderId === currentUser
                          ? "message own"
                          : "message"
                      }
                    >
                      <span style={{ color: "white" }}>{message.text}</span>
                      <span>{format(message.createdAt)}</span>
                    </div>
                  ))}
                </div>

                {/* chat sender */}
                <div className="chat-sender">
                  {/* <div>+</div> */}
                  <InputEmoji value={newMessage} onChange={handleChange} />
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background:
                        "linear-gradient(180deg, #4540db 20%, #509ff9 100%)",
                      // backgroundColor: "#4540DB",

                      "&:hover": {
                        backgroundColor: "#413AFD",
                      },
                    }}
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <span style={{ marginTop: "1.5rem" }}>
                <Typography
                  variant="h5"
                  color="gray"
                  sx={{ textAlign: "center" }}
                >
                  Tap on a chat to Start Conversation...
                </Typography>
              </span>
            )}
          </div>
        </StyledPaper>
      </Box>
    </>
  );
};

export default ChatBox;
