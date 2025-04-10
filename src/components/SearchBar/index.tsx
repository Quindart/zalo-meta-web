import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { StyledInputBase, SearchIconWrapper, Search } from "./style";

interface CustomSearchBarProps {
  placeholder?: string;
}

export default function CustomSearchBar({
  placeholder,
  ...rest
}: CustomSearchBarProps) {
  return (
    <Box>
      <Search
        sx={{
          backgroundColor: "#EBECF0",
          border: "none",
          height: "30px",
        }}
      >
        <SearchIconWrapper>
          <SearchIcon sx={{ width: 16 }} />
        </SearchIconWrapper>
        <StyledInputBase
          sx={{
            backgroundColor: "#EBECF0",
            fontSize: 15,
          }}
          placeholder={placeholder || "Tìm kiếm"}
          inputProps={{ "aria-label": "search" }}
          {...rest}
        />
      </Search>
    </Box>
  );
}
