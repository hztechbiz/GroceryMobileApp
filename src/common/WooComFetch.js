import axios from 'axios'
import theme from './Theme.style'
import md5 from 'react-native-md5'
// Get Request
export const getHeaders = () => {
  const d = new Date()
  return {
    headers: {
      'consumer-key': md5.hex_md5(theme.consumerKey).toString(),
      'consumer-secret': md5.hex_md5(theme.consumerSecret).toString(),
      'consumer-nonce':
        d.getMilliseconds().toString() +
        d.getTime().toString() +
        '-' +
        Math.floor(Math.random() * 999) +
        1,
      'consumer-device-id': theme.deviceId,
      'consumer-ip': theme.ipAdress + '.' + d.getMilliseconds().toString(),
      'Content-Type': 'application/json'
    }
  }
}

export const postHttp = async (url, body) => {
  try {
    const res = await axios.post(url, body, getHeaders())
    return res.data
  } catch (err) {
    return err
  }
}

// Get Request
export const getHttp = async (url, body) => {
  try {
    const res = await axios.get(url, getHeaders())
    return res
  } catch (err) {
    return err
  }
}

// Get Request
export const getUrl = () => {
  if (theme.url.startsWith('https')) {
    return theme.url
  } else {
    return theme.url.replace('http', 'https')
  }
}

const WooComFetch = {
  postHttp: async (url, body) => {
    const returnObject = {}
    try {
      const res = await axios.post(url, body, getHeaders())
      returnObject.success = res.data.success
      returnObject.data = res.data
      return returnObject
    } catch (err) {
      return err
    }
  },

  getAllBanners: async type => {
    try {
      const response = await getHttp(
        theme.url.startsWith('https')
          ? theme.url + '/api/' + type
          : theme.url.replace('http', 'https') + '/api/' + type,
        {}
      )
      return response
    } catch (err) {
      return err
    }
  }
}
export default WooComFetch
