import { FetchBanks, VerifyBankDetails } from "@/app/lib/paystack"
import { UpdateBankDetails } from "@/app/lib/fetchRequests"
import { PaystackBank, UserData } from "@/app/lib/types"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import path from "path"
import { useState, useEffect, useRef, useCallback } from "react"

type BankForm = Omit<UserData["bank_details"], "accountName" | "bankCode">



interface BankVerificationProps extends BankForm {
    isOpen: boolean
    onClick?: () => void
}

const BankVerification: React.FC<BankVerificationProps> = ({
    bankName,
    accountNumber,
    isOpen,
    onClick
}) => {

    const [formData, setFormData] = useState<BankForm>({
        bankName: bankName,
        accountNumber: accountNumber
    })

    const [banks, setBanks] = useState<PaystackBank[]>([])
    const [filteredBanks, setFilteredBanks] = useState<PaystackBank[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingBanks, setIsFetchingBanks] = useState(false)
    const [verifiedName, setVerifiedName] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    
    useEffect(() => {
        const fetchBanks = async () => {
            setIsFetchingBanks(true)
            try {
                const data = await FetchBanks()
             
                if (data.status && data.data) {
                    setBanks(data.data)
                }
            } catch (err) {
                console.error("Failed to fetch banks:", err)
            } finally {
                setIsFetchingBanks(false)
            }
        }

        if (isOpen) {
            fetchBanks()
        }
    }, [isOpen])

    // Filter banks based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBanks([])
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = banks.filter(bank =>
            bank.name.toLowerCase().includes(query) ||
            bank.code.includes(query)
        ).slice(0, 8)

        setFilteredBanks(filtered)
    }, [searchQuery, banks])
  const pathname = usePathname()
   
    useEffect(() => {
          if(pathname === "/startcauses") return ;
        const handleClickOutside = (event: MouseEvent) => {
   
               

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
           
                     
                setShowDropdown(false)
           
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleBankSelect = (bank: PaystackBank) => {
        setFormData(prev => ({
            ...prev,
            bankName: bank.name
        }))
        setSearchQuery(bank.name)
        setShowDropdown(false)
        setVerifiedName(null)
        setError(null)
        setSubmitSuccess(false)
    }

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\\D/g, "").slice(0, 10)
        setFormData(prev => ({
            ...prev,
            accountNumber: value
        }))
        setVerifiedName(null)
        setError(null)
        setSubmitSuccess(false)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        setShowDropdown(true)
        if (value === "") {
            setFormData(prev => ({ ...prev, bankName: "" }))
        }
    }

    const verifyAccount = useCallback(async () => {
        if (!formData.bankName || !formData.accountNumber || formData.accountNumber.length < 10) {
            setError("Please select a bank and enter a valid 10-digit account number")
            return
        }

        setIsLoading(true)
        setError(null)
        setVerifiedName(null)

        try {
            const selectedBank = banks.find(b => b.name === formData.bankName)
            if (!selectedBank) {
                setError("Bank not found")
                setIsLoading(false)
                return
            }

            const data = await VerifyBankDetails(formData.accountNumber, selectedBank.code)


            if (data.status && data.data) {
                setVerifiedName(data.data.account_name)
            } else {
                setError(data.message || "Account verification failed")
            }
        } catch (err) {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [formData.bankName, formData.accountNumber, banks])

    const {data:session} = useSession()

    const handleSubmitToDatabase = async () => {
        if (!verifiedName || !formData.bankName || !formData.accountNumber) {
            setError("Please verify the account first before submitting")
            return
        }

        const selectedBank = banks.find(b => b.name === formData.bankName)
        if (!selectedBank) {
            setError("Bank information missing")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const payload = {
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountName: verifiedName,
                bankCode: selectedBank.code,
                email: session?.user?.email as string,
            }

           const response = await UpdateBankDetails(payload)
              if (response.error) {
                 setError(response.error)
                 return
              }

                setSubmitSuccess(true)
                setTimeout(() => {
                       window.location.reload()
                       setShowDropdown(false)
                       onClick && onClick() 
                }, 2000)
            

        } catch (err) {
            setError("Failed to save to database. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (verifiedName) {
            await handleSubmitToDatabase()
        } else {
            await verifyAccount()
        }
    }

    if (!isOpen) return null

    return (
        <div className="w-screen h-screen fixed left-0 top-0 z-40 flex items-center justify-center">
            {/* Translucent blur overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
                onClick={onClick}
            />

            {/* Modal card on top */}
            <div className="relative bg-white rounded-xl p-8 shadow-xl w-full max-w-md mx-4">
                <div className="font-bold text-2xl text-black text-center mb-6">
                    Bank Verification
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Bank Name Search with Autocomplete */}
                    <div className="relative" ref={dropdownRef}>
                        <label htmlFor="bankSearch" className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name
                        </label>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                id="bankSearch"
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.trim() !== "" && setShowDropdown(true)}
                                placeholder="Type to search banks..."
                                disabled={isLoading || isSubmitting}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
                                autoComplete="off"
                            />
                            {isFetchingBanks && (
                                <svg
                                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {showDropdown && filteredBanks.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {filteredBanks.map((bank) => (
                                    <button
                                        key={bank.code}
                                        type="button"
                                        onClick={() => handleBankSelect(bank)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <div className="font-medium text-sm text-gray-900">
                                            {bank.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            Code: {bank.code} · {bank.type}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {showDropdown && searchQuery.trim() !== "" && filteredBanks.length === 0 && !isFetchingBanks && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                                No banks found matching &quot;{searchQuery}&quot;
                            </div>
                        )}
                    </div>

                    {/* Account Number */}
                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number
                        </label>
                        <input
                            id="accountNumber"
                            name="accountNumber"
                            type="text"
                            inputMode="numeric"
                            value={formData.accountNumber}
                            onChange={handleAccountNumberChange}
                            placeholder="Enter 10-digit account number"
                            disabled={isLoading || isSubmitting}
                            maxLength={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                                {formData.accountNumber?.length}/10 digits
                            </span>
                        </div>
                    </div>

                    {/* Verified Account Name Display */}
                    {verifiedName && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-sm font-medium text-green-800 mb-1">
                                Account Verified
                            </div>
                            <div className="text-sm text-green-700">
                                {verifiedName}
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-sm font-medium text-blue-800 mb-1">
                                Success
                            </div>
                            <div className="text-sm text-blue-700">
                                Bank details saved successfully!
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="text-sm text-red-700">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {/* Verify Button - shown when not yet verified */}
                        {!verifiedName && (
                            <button
                                type="submit"
                                disabled={isLoading || !formData.bankName || (formData.accountNumber as any)?.length < 10}
                                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    "Verify Bank Account"
                                )}
                            </button>
                        )}

                        {/* Submit Button - shown after verification */}
                        {verifiedName && !submitSuccess && (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    "Submit to Database"
                                )}
                            </button>
                        )}
                    </div>

                    {/* Reset Button - shown after success */}
                    {submitSuccess && (
                        <button
                            type="button"
                            onClick={() => {
                               window.location.reload()
                               setShowDropdown(false)
                               onClick && onClick()
                            }}
                            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Continue 
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default BankVerification
