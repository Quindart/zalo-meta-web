import { PayloadAction, createSlice } from '@reduxjs/toolkit';
interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    avatar: string
}
export interface InitUserType {
    me: {
        user: Partial<User>;
    }
}

const initUser: InitUserType = {
    me: {
        user: {
            id: '',
            fullName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            firstName: '',
            lastName: '',
            avatar: ''
        },
    },
};


export const useUser = createSlice({
    name: 'userSlice',
    initialState: initUser,
    reducers: {
        setMe: (state: InitUserType, { payload }: PayloadAction<any>) => {
            state.me = payload;
        },
    },
});
export const {
    setMe,
} = useUser.actions;

export default useUser.reducer;