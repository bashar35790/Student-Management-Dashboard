import { configureStore } from '@reduxjs/toolkit'
import studentListReducer from '@/redux/features/studentListSlice'
import { studentApi } from '@/redux/services/studentApi'

export const makeStore = () =>
  configureStore({
    reducer: {
      studentApi: studentApi.reducer,
      studentList: studentListReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(studentApi.middleware),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']