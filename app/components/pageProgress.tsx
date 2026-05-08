"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"


NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.1,
})

export default function PageProgress() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        NProgress.start()
        
        const timer = setTimeout(() => {
            NProgress.done()
        }, 300)

        return () => {
            clearTimeout(timer)
            NProgress.done()
        }
    }, [pathname, searchParams])

    return null
}