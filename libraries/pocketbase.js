import PocketBase from 'pocketbase'
import {useCookies} from 'react-cookie'

const pocketbase = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)

const useAuthCookies = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['auth.token', 'auth.model', 'auth.expiry'])

  // Set session expiration to 168 hours (1 week).
  pocketbase.authStore.save = (token, model) => {
    const expiry = Date.now() + 168 * 60 * 60 * 1000
    setCookie('auth.token', token, { path: '/', expires: new Date(expiry) })
    setCookie('auth.model', JSON.stringify(model), { path: '/', expires: new Date(expiry) })
    setCookie('auth.expiry', expiry, { path: '/', expires: new Date(expiry) })
  }

  pocketbase.authStore.load = () => {
    const expiry = cookies['auth.expiry']
    if (!expiry || Date.now() >= expiry) {
      pocketbase.authStore.clear()
      removeCookie('auth.token')
      removeCookie('auth.model')
      removeCookie('auth.expiry')
    } else {
      pocketbase.authStore.token = cookies['auth.token']
      pocketbase.authStore.model = JSON.parse(cookies['auth.model'])
    }
  }

  return { pocketbase }
}

export default pocketbase