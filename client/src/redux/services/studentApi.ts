import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/api'
import type {
  ApiEnvelope,
  PaginatedResult,
  Student,
  StudentInput,
  StudentQuery,
  UpdateStudentInput,
} from '@/types/student'

function unwrap<T>(response: unknown): T {
  return (response as ApiEnvelope<T>).data
}

function unwrapPaginated(response: unknown): PaginatedResult<Student> {
  const envelope = response as ApiEnvelope<Student[]>
  return { data: envelope.data, meta: envelope.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 } }
}

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedResult<Student>, StudentQuery>({
      query: (params) => ({ url: '/students', params }),
      transformResponse: (response: unknown) => unwrapPaginated(response),
      providesTags: ['Student'],
    }),
    getStudent: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      transformResponse: (response: unknown) => unwrap<Student>(response),
      providesTags: (_result, _error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation<Student, StudentInput>({
      query: (body) => ({ url: '/students', method: 'POST', body }),
      transformResponse: (response: unknown) => unwrap<Student>(response),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation<Student, { id: string; body: UpdateStudentInput }>({
      query: ({ id, body }) => ({ url: `/students/${id}`, method: 'PATCH', body }),
      transformResponse: (response: unknown) => unwrap<Student>(response),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),
    deleteStudent: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Student'],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi