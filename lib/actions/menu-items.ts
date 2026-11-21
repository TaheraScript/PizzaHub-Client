const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

//add menu item(vendor)
export const createMenu = async(data: unknown)=>{
    const res = await fetch(`${BASE_URL}/menu-items`,{
        method: 'POST',
        headers:{
            'content-type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    return res.json()
}