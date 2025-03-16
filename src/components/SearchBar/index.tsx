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
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={placeholder || "Tìm kiếm"} // Placeholder mặc định nếu không truyền vào
          inputProps={{ "aria-label": "search" }}
          {...rest}
        />
      </Search>
    </Box>
  );
}
