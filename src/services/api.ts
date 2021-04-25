import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://thejullius-podcastr-server.herokuapp.com'
})

