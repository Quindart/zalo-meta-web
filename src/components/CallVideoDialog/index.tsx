import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useMemo, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useVideo from "@/hook/api/useVideo";

function randomID(len = 5) {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateToken(tokenServerUrl: string, appID: number, userID: string) {
  return fetch(tokenServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_id: appID,
      user_id: userID,
    }),
  }).then(async (res) => {
    const result = await res.text();
    return result;
  });
}

export function getUrlParams(
  url: string = window.location.href,
): URLSearchParams {
  const parts = url.split("?");
  return new URLSearchParams(parts[1] || "");
}

function CallVideoDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { initCall, roomID, userID, userName, containerRef, instanceRef } =
    useVideo();
    
  useEffect(() => {
    if (open) {
      initCall();
    }

    return () => {
      if (!open && containerRef.current) {
        containerRef.current.innerHTML = "";
        instanceRef.current = null;
      }
    };
  }, [open, roomID, userID, userName]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Video call
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div ref={containerRef} style={{ width: "100%", height: "80vh" }} />
      </DialogContent>
    </Dialog>
  );
}

export default CallVideoDialog;
