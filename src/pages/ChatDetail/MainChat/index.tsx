import { useRef } from "react";
import MessageChat from "@/components/Message";
import { Box, CircularProgress } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";

function MainChat({
  messages,
  loading = false,
}: {
  messages: any[];
  loading?: boolean;
}) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Box
        sx={{
          maxWidth: "calc(100% - 340px)",
          height: "100vh",
          bgcolor: "grey.300",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
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
            // overflowY: "auto",
            paddingBottom: "80px", // Chừa chỗ cho ô nhập tin nhắn
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                mx: 1,
                my: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {Array.isArray(messages) && messages.length > 0 ? (
                messages.map((mess: any, index: number) => (
                  <MessageChat key={index} {...mess} />
                ))
              ) : (
                <Box sx={{ textAlign: "center", color: "grey.500", mt: 3 }}>
                  Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                </Box>
              )}
            </Box>
          )}
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
    </>
  );
}

export default MainChat;
