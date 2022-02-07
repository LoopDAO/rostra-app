export const contract = (library: any) => (...args: [any, ...any[]]) => {
    const [method, ...params] = args
    console.log('fetcher method and params: ', method, params)
    return library[method](...params)
}

export const http = async (url: string) => {
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}

const fetchers = {
    contract,
    http
}

export default fetchers