import axios from 'axios'

export const fetchPost = async (game: string, platform: string) => {
    const response = await axios.get(`/${platform}/${game}`)
    return response.data
}

export const summarize = async (text: string) => {
    const response = await axios.post(`/summarize`, { text })
    return response.data
}

export const getAlldata = async () => {
    const response = await axios.get(`/alldata`)
    return response.data
}

export const getDataOfDate = async (date: string) => {
    const response = await axios.get(`/data/${date}`)
    return response.data
}

export const resetData = async () => {
    const response = await axios.delete(`/alldata`)
    return response.data
}

export const resetDataOfDate = async (date: string) => {
    const response = await axios.delete(`/data/${date}`)
    return response.data
}

export const getAvailableData = async () => {
    const response = await axios.get(`/availableData`)
    return response.data
}

export const downloadAllData = async () => {
    const response = await axios.get(`/downloadAll`, {
        responseType: 'blob',
    })
    return response.data
}

export const downloadDataOfDate = async (date: string) => {
    const response = await axios.get(`/download/${date}`, {
        responseType: 'blob',
    })
    return response.data
}
