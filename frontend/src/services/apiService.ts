import axios, { AxiosError, type AxiosResponse } from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export class ApiService {
  static get = async <T>(path: string): Promise<T> => {
    try {
      const url = `${API_URL}/${path}`
      const res: AxiosResponse<T> = await axios.get(url)

      return res.data
    } catch (e) {
      const axiosError = e as AxiosError
      const { data = {} } = axiosError.response || {}
      throw new Error(typeof data === 'string' ? data : 'Something went wrong')
    }
  }

  static delete = async <T>(path: string, body: Record<string, unknown> = {}): Promise<T> => {
    try {
      const url = `${API_URL}/${path}`
      const res: AxiosResponse<T> = await axios.request({
        method: 'delete',
        url: url,
        data: body,
      })

      return res.data
    } catch (e) {
      const axiosError = e as AxiosError
      const { data = {} } = axiosError.response || {}
      throw new Error(typeof data === 'string' ? data : 'Something went wrong')
    }
  }

  static post = async <T>(path: string, body?: Record<string, unknown>): Promise<T> => {
    try {
      const url = `${API_URL}/${path}`
      const res: AxiosResponse<T> = await axios.post(url, body)

      return res.data
    } catch (e) {
      const axiosError = e as AxiosError
      const { data = {} } = axiosError.response || {}
      throw new Error(typeof data === 'string' ? data : 'Something went wrong')
    }
  }

  static put = async <T>(path: string, body: Record<string, unknown> = {}): Promise<T> => {
    try {
      const url = `${API_URL}/${path}`
      const res: AxiosResponse<T> = await axios.put(url, body)

      return res.data
    } catch (e) {
      const axiosError = e as AxiosError
      const { data = {} } = axiosError.response || {}
      throw new Error(typeof data === 'string' ? data : 'Something went wrong')
    }
  }
}
