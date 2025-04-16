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
    friends: any[];
    sendFriends: any[];
    receiveFriends: any[];
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
    sendFriends: [],
    receiveFriends: [],
    friends: [],
};


export const useUser = createSlice({
    name: 'userSlice',
    initialState: initUser,
    reducers: {
        setMe: (state: InitUserType, { payload }: PayloadAction<any>) => {
            state.me = payload;
        },
        setFriends: (state: InitUserType, { payload }: PayloadAction<any>) => {
            state.friends = payload;
        },
        setSendFriends: (state: InitUserType, { payload }: PayloadAction<any>) => {
            state.sendFriends = payload;
        },
        setReceiveFriends: (state: InitUserType, { payload }: PayloadAction<any>) => {
            state.receiveFriends = payload;
        },
    },
});
export const {
    setMe,
    setFriends,
    setSendFriends,
    setReceiveFriends,
} = useUser.actions;

export default useUser.reducer;