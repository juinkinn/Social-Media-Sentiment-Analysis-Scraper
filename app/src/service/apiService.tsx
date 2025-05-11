import axios from 'axios'

const baseURL = import.meta.env.MODE ? 'http://localhost:5000' : ''

export const fetchPost = async (game: string, platform: string) => {
    const response = await axios.get(`${baseURL}/${platform}/${game}`)
    return response.data
}

export const summarize = async (text: string) => {
    const response = await axios.post(`${baseURL}/summarize`, { text })
    return response.data
}

export const getAlldata = async () => {
    const response = await axios.get(`${baseURL}/alldata`)
    return response.data
}

export const getDataOfDate = async (date: string) => {
    const response = await axios.get(`${baseURL}/data/${date}`)
    return response.data
}

export const resetData = async () => {
    const response = await axios.delete(`${baseURL}/alldata`)
    return response.data
}

export const resetDataOfDate = async (date: string) => {
    const response = await axios.delete(`${baseURL}/data/${date}`)
    return response.data
}

export const getAvailableData = async () => {
    const response = await axios.get(`${baseURL}/availableData`)
    return response.data
}