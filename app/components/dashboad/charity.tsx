import { GetCenter } from "@/app/lib/fetchRequests"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Button from "../ui/button"
import { redirect } from "next/navigation"


interface Center {
    name: string
    website: string
    address: string
    is_verified_status: string
    recived: string 
    logourl: string
    id:number
}

export default function CharityProp() {
    const { data: session } = useSession()
    const [centers, setCenters] = useState<Center[]>([])
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState(false)

    const fetchData = async () => {
        if (!session?.user?.email) return

        try {
            setLoadError(false)
            setLoading(true)
            const resp = await GetCenter("OWNED", session.user.email)
            setCenters(resp)
        } catch (error) {
            console.error(error)
            setLoadError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [session])

     const getStatusBadge = (status: string) => {
    if (status?.toLowerCase() === "verified") {
        return (
            <span className="inline-flex items-center transition-transform duration-300 hover:scale-110" title="Verified Charity">
                <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                </svg>
            </span>
        )
    }

    if (status?.toLowerCase() === "pending") {
        return (
            <span className="inline-flex items-center transition-transform duration-300 hover:scale-110" title="Pending Verification">
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        )
    }

    if (status?.toLowerCase() === "rejected") {
        return (
            <span className="inline-flex items-center transition-transform duration-300 hover:scale-110" title="Not Approved">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        )
    }

    return null
}

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
        <h1 className="text-2xl font-bold text-gray-900">My Charity Centers</h1>
        <p className="mt-1 text-sm text-gray-500">
            Manage and view your registered charity centers.
        </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={()=>redirect("/dashboard/centers/manage")} details="Charity Dashboard" />
        <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            {centers.length} center{centers.length !== 1 ? "s" : ""}
        </span>
    </div>
</div>
            {loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="h-4 w-24 rounded bg-gray-200" />
                                <div className="h-5 w-16 rounded-full bg-gray-200" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 w-full rounded bg-gray-200" />
                                <div className="h-3 w-3/4 rounded bg-gray-200" />
                                <div className="mt-4 h-8 w-full rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {loadError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                        <svg
                            className="h-8 w-8 text-red-600 sm:mr-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <div className="mt-3 sm:mt-0">
                            <h3 className="text-base font-semibold text-red-800">
                                Failed to load centers
                            </h3>
                            <p className="mt-1 text-sm text-red-700">
                                There was an error fetching your charity centers.
                            </p>
                            <button
                                onClick={fetchData}
                                className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!loading && !loadError && centers.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-gray-900">
                        No centers found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        You haven't registered any charity centers yet.
                    </p>

                    <div className="my-4">
                         <Button variant="secondary" details="Add Center" size="md" onClick={()=>redirect("/dashboard/centers/manage")} />
                    </div>
                </div>
            )}

           {!loading && !loadError && centers.length > 0 && (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {centers.map((center, index) => {
            const isVerified = center.is_verified_status.toLowerCase() === "verified" || 
                               center.is_verified_status.toLowerCase() === "true"

            return (
                <div
                    key={index}
                    className="group relative flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 pr-4 min-w-0">
                            {center.logourl ? (
                                <img
                                    src={center.logourl}
                                    alt={`${center.name} logo`}
                                    className="h-10 w-10 shrink-0 rounded-lg object-cover border border-gray-100"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 border border-gray-100">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                                {center.name}
                            </h3>
                        </div>
                        {getStatusBadge(center.is_verified_status)}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                            <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {center.address}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <svg
                                className="h-4 w-4 shrink-0 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                            </svg>
                            <a
                                href={center.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {center.website}
                            </a>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Total Received
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                               ₦{center.recived}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <Button
                            variant={isVerified ? "primary" : "secondary"}
                            size="sm"
                            details="Run Campaign"
                            disabled={!isVerified}
                            onClick={() => isVerified && redirect(`/dashboard/centers/campaign?id=${center.id}`)}
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            details="Public Profile"
                            onClick={() => redirect(`/dashboard/centers/profile?id=${center.id}`)}
                        />
                    </div>
                </div>
            )
        })}
    </div>
)}
        </div>
    )
}