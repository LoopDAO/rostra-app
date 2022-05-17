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

export const getCellsCapacity = async (url: string, script: any) => {
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            id: 1000,
            jsonrpc: '2.0',
            method: 'get_cells_capacity',
            params: [
                {
                    script: {
                        code_hash: script.codeHash,
                        hash_type: script.hashType,
                        args: script.args,
                    },
                    script_type: 'lock'
                }
            ]
        })
    })
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}

const fetchers = {
    contract,
    http,
    getCellsCapacity,
}

export default fetchers