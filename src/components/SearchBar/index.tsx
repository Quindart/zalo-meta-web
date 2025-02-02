import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { StyledInputBase, SearchIconWrapper, Search } from "./style";

interface CustomSearchBarProps {
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export default function CustomSearchBar({
  placeholder,
  onChange,
  value,
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
          onChange={onChange} // Sự kiện khi người dùng nhập
          value={value} // Giá trị hiện tại của input
        />
      </Search>
    </Box>
  );
}
