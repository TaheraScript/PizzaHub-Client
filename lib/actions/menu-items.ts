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

//delete menu item(vendor)
export const deleteMenu = async (menuId: string) => {
    const res = await fetch(`${BASE_URL}/menu-items/${encodeURIComponent(menuId)}`, {
        method: 'DELETE',
    })

    const data = res.status === 204 ? {} : await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new Error(data?.message || `Failed to delete menu item (${res.status})`)
    }

    return data
}