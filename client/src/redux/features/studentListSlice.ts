import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StudentStatus } from '@/types/student'

export type StatusFilter = '' | StudentStatus

interface StudentListState {
  search: string
  status: StatusFilter
  class: string
  page: number
  sortBy: 'name' | 'createdAt' | 'class'
  sortOrder: 'asc' | 'desc'
}

const initialState: StudentListState = {
  search: '',
  status: '',
  class: '',
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const studentListSlice = createSlice({
  name: 'studentList',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1
    },
    setStatus(state, action: PayloadAction<StatusFilter>) {
      state.status = action.payload
      state.page = 1
    },
    setClassFilter(state, action: PayloadAction<string>) {
      state.class = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: StudentListState['sortBy']; sortOrder: StudentListState['sortOrder'] }>,
    ) {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
      state.page = 1
    },
  },
})

export const { setSearch, setStatus, setClassFilter, setPage, setSort } = studentListSlice.actions

export default studentListSlice.reducer