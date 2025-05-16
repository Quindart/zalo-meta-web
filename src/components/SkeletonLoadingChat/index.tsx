import { Box, Divider, List, ListItem, Skeleton } from "@mui/material";

const SkeletonLoadingChat = () => {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "grey.50",
        position: "relative",
        marginLeft: "59px",
        height: "100vh",
      }}
    >
      {/* SkeletonLoadingChat Container */}
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", px: 2, py: 1, alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="text" width={200} height={40} />
          </Box>
          <Box>
            <Skeleton
              variant="rounded"
              width={120}
              height={30}
              sx={{ mr: 1 }}
            />
          </Box>
        </Box>

        {/* SkeletonLoadingChat Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            pt: 2,
            bgcolor: "#f0f0f0",
          }}
        >
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}
            >
              <Skeleton
                variant="circular"
                width={30}
                height={30}
                sx={{ mr: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={150}
                height={40}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton variant="text" width={40} height={20} sx={{ ml: 1 }} />
            </Box>
          ))}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={40}
            sx={{ mx: 1, borderRadius: 20 }}
          />
          <Skeleton variant="circular" width={30} height={30} sx={{ mr: 1 }} />
          <Skeleton
            variant="rounded"
            width={40}
            height={40}
          />
        </Box>
      </Box>

      {/* Sidebar */}
      <Box sx={{ flex: 1, p: 1 }}>
        <Skeleton variant="text" width={"100%"} height={40} />
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={50} height={50} />
          <Skeleton variant="text" width={120} height={30} sx={{ my: 1 }} />
          <Box sx={{ display: "flex" }}>
            <Skeleton
              variant="circular"
              width={30}
              height={30}
              sx={{ mr: 1 }}
            />
            <Skeleton
              variant="circular"
              width={30}
              height={30}
              sx={{ mr: 1 }}
            />
            <Skeleton
              variant="circular"
              width={30}
              height={30}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
        </Box>
        <Skeleton variant="text" width={"100%"} height={30} sx={{ mt: 2 }} />
        <List
          sx={{
            justifyContent: "center",
          }}
          className="flex flex-col justify-center"
        >
          {[...Array(5)].map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="text" width="100%" height={30} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SkeletonLoadingChat;
