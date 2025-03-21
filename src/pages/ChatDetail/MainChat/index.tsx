import { useRef } from "react";
import MessageChat from "@/components/Message";
import { Box } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "../ChatInput";


function MainChat({ messages }: { messages: any[] }) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // alert(JSON.stringify(me));
  return (
    <>
      <Box
        sx={{
          maxWidth: "calc(100% - 358px)",
          height: "600px",
          bgcolor: "grey.300",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header - Thanh thông tin người dùng */}
        <Box
          sx={{
            height: 65,
            flexShrink: 0,
            bgcolor: "white",
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: "1px solid #ddd",
            borderRight: "1px solid #ddd",
          }}
        >
          <InfoUser />
        </Box>

        {/* Vùng hiển thị tin nhắn */}
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            paddingBottom: "80px", // Chừa chỗ cho ô nhập tin nhắn
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              mx: 1,
              my: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {Array.isArray(messages) &&
              messages.map((mess: any, index: number) => (
                <MessageChat key={index} {...mess} />
              ))}
          </Box>
        </Box>

        {/* Ô nhập tin nhắn - Cố định phía dưới */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "white",
            border: "1px solid #ccc",
            zIndex: 10, // Đảm bảo luôn hiển thị trên tin nhắn
          }}
        >
          <ChatInput />
        </Box>
      </Box>
      <Box display={"flex"} gap={2}></Box>
    </>
  );
}

export default MainChat;