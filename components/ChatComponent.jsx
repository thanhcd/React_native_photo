// ChatComponent.jsx
import React from "react";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { getClient } from "../lib/streamchat";

const ChatComponent = ({ children }) => {
  const client = getClient(); // Lấy client đã khởi tạo

  return (
    <OverlayProvider>
      <Chat client={client}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};

export default ChatComponent;
