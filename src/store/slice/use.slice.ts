import { PayloadAction, createSlice } from '@reduxjs/toolkit';
interface User {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    phone: string;
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
            gender: '',
            phone: ''
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