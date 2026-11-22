import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT } from "jose"

import { auth } from "../auth"

const jwtKey = new TextEncoder().encode(process.env.JWT_SECRET ?? "")

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
    const session = await getSession()
    if (!session || !session.user) {
        redirect("/sign-in")
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set")
    }
    // Short-lived JWT sent as a Bearer token to the Express API, which verifies
    // the signature + expiry and reloads the user for an authoritative role.
    return await new SignJWT({ role: session.user.role, email: session.user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(session.user.id)
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(jwtKey)
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