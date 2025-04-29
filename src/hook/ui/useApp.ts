import { RootState } from '@/store';
import { setLoading } from '@/store/slice/app.slice';
import { useDispatch, useSelector } from 'react-redux'

function useApp() {
    const appStore = useSelector((state: RootState) => state.appSlice)
    const dispatch = useDispatch()
    const loading = appStore.loading
    const toggleLoading = (loading: boolean) => {
        dispatch(setLoading(loading))
    }
    return { loading, toggleLoading }
}

export default useApp