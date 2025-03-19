import styled from '@emotion/styled';
import { MaterialDesignContent } from "notistack";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-warning': {
        backgroundColor: '#dd7a01',
    },
    '&.notistack-MuiContent-info': {
        backgroundColor: '#299cdb',
    },
    '&.notistack-MuiContent-success': {
        backgroundColor: '#4fd06b',
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: '#ba0517',
    },
}));
export const themeSnackbar = {
    warning: StyledMaterialDesignContent,
    info: StyledMaterialDesignContent,
    success: StyledMaterialDesignContent,
    error: StyledMaterialDesignContent,
};


