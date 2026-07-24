import type { UserRole } from './transaction'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  role: UserRole
  name: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  code: string
}
