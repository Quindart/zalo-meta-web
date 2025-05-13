import { createSlice, PayloadAction } from "@reduxjs/toolkit"


export interface InitAppType {
    loading: boolean
}

const initApp: InitAppType = {
    loading: false
}

export const useAppStore = createSlice(
    {
        name: 'appSlice',
        initialState: initApp,
        reducers: {
            setLoading: (state: InitAppType, { payload }: PayloadAction<boolean>) => {
                state.loading = payload
            }
        }
    }
)

export const {
    setLoading
} = useAppStore.actions;

export default useAppStore.reducer;