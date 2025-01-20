import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f5f5f5',
    border: '1px solid #d9d9d9',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '40px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#333',
    flex: 1,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1),
        fontSize: '14px',
    },
}));

import React from 'react';

interface CustomSearchBarProps {
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

export default function CustomSearchBar({ placeholder, onChange, value }: CustomSearchBarProps) {
    return (
        <Box>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={placeholder || 'Tìm kiếm'} // Placeholder mặc định nếu không truyền vào
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={onChange} // Sự kiện khi người dùng nhập
                    value={value} // Giá trị hiện tại của input
                />
            </Search>
        </Box>
    );
}
