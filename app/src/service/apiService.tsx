import axios from 'axios'

export const fetchPost = async (game: string, platform: string) => {
    const response = await axios.get(`/${platform}/${game}`)
    return response.data
}

export const summarize = async (text: string) => {
    const response = await axios.post('/summarize', { text })
    return response.data
}

export const getAlldata = async () => {
    const response = await axios.get('/alldata')
    return response.data
}

export const getDataOfDate = async (date: string) => {
    const response = await axios.get(`/data/${date}`)
    return response.data
}
