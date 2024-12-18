import PocketBase from 'pocketbase'

const pocketbase = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)

// Set session expiration to 168 hours (1 week).
pocketbase.authStore.save = (token, model) => {
    localStorage.setItem(pocketbase.authStore.storageKey, JSON.stringify({
        token: token,
        model: model,
        expiry: Date.now() + 168 * 60 * 60 * 1000
    }))
}

pocketbase.authStore.load = () => {
    const raw = localStorage.getItem(pocketbase.authStore.storageKey)
    if (!raw) return

    const data = JSON.parse(raw)
    if (Date.now() >= data.expiry) pocketbase.authStore.clear()
    else {
        pocketbase.authStore.token = data.token
        pocketbase.authStore.model = data.model
    }
}

export default pocketbase