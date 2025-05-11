import axios from 'axios'
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

export const fetchPost = async (game: string, platform: string) => {
    const response = await axios.get(`${baseUrl}/${platform}/${game}`)
    return response.data
}

export const summarize = async (text: string) => {
    const response = await axios.post(`${baseUrl}/summarize`, {text})
    return response.data
}

export const getAlldata= async () => {
    const response = await axios.get(`${baseUrl}/allData`)
    return response.data
}

export const getDataOfDate= async (date: string) => {
    // date format: YYYY-MM-DD
    const response = await axios.get(`${baseUrl}/data/${date}`)
    return response.data
}