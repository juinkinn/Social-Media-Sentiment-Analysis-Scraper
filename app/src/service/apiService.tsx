import axios from 'axios'
const baseUrl = 'http://127.0.0.1:5000'

export const fetchPost = async (game: string, platform: string) => {
    const response = await axios.get(`${baseUrl}/${platform}/${game}`)
    return response.data
}