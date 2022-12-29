import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { getRequest } from "../../../helper/HandleRequest";

const Conversation = ({ data, currentUserId, setCurrentChat, online }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userId = data?.members.find((id) => id !== currentUserId);
    getRequest(`/getUser/${userId}`).then((res) => {
      const { returnedValue } = res;
      setUserData(returnedValue);
    });
  }, [currentUserId, data?.members]);
  return (
    <>
      <div
        className="follower conversation"
        style={{ width: "95%" }}
        onClick={() => setCurrentChat(data)} //chat data to chat box
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div>
            {online && <div className="online-dot"></div>}
            <Avatar src={userData?.profile_pic} />
          </div>
          <div
            className="name"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              {userData?.name}
            </span>
            <span
              style={{
                fontSize: "0.8rem",
              }}
            >
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "95%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
