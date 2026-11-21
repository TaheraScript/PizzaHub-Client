const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getMenu = async(query='')=>{
    const res = await fetch(`${BASE_URL}/menu-items?{query}`)
    return res.json()
}