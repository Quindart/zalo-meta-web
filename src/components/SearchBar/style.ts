import { Box, InputBase, styled } from "@mui/material";

const Search = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5",
  border: "1px solid #d9d9d9",
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "40px",
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#666",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#333",
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    fontSize: "14px",
  },
}));

export { StyledInputBase, SearchIconWrapper, Search };
