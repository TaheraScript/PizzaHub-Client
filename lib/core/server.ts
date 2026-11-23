import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "../auth"

export const getSession = async()=>{
    'use server'
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
}

export const protectedMutation = async (api: string,method: string, body?: unknown) => {
    const token = await getToken()
    const res = await fetch(api, {
        method: method, 
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
    })
    if(res.status === 401 || res.status === 403){
        redirect("/unauthorized")
    }
    return res
}

export const requireSession = async () => {
    const session = await getSession()
    if (!session || !session.user) {
        redirect("/sign-in")
    }
    if (session.user.isBlocked) {
        redirect("/unauthorized")
    }
    return session
}

export const requireRole = async (role: string) => {
    const session = await requireSession()
    if (session.user.role !== role) {
        redirect("/unauthorized")
    }
    return session
}
export const getToken = async () => {
    const requestHeaders = await headers()
    const session = await auth.api.getSession({ headers: requestHeaders })
    if (!session || !session.user) {
        redirect("/sign-in")
    }
    // Better Auth mints a short-lived JWT (subject = user id, signed with its
    // asymmetric key). The Express API verifies it against /api/auth/jwks.
    const { token } = await auth.api.getToken({ headers: requestHeaders })
    return token
}

export const authFetch = async(api : string) => {
    const token = await getToken()
    const res = await fetch(api, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    return res
}