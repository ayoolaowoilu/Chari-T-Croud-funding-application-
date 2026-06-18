import { useEffect, useState } from "react";
import { FetchProfile } from "@/app/lib/fetchRequests";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CircleAlert,
  Mail,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  CreditCard,
  User,
  ShieldCheck,
  LogOut,
  Pencil,
  Check,
  X,
  Shield,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Zap,
  FileCheck,
  Lock,
} from "lucide-react";
import { UserData } from "@/app/lib/types";
import Button from "../ui/button";
import BankVerification from "../layout/bankVerification";

interface ProfileResponse {
  userData: UserData;
  kyc: boolean;
}

const methodConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  google: {
    label: "Google",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: "G",
  },
  twitter: {
    label: "Twitter",
    color: "text-slate-900",
    bg: "bg-slate-100",
    icon: "X",
  },
  facebook: {
    label: "Facebook",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: "f",
  },
};

export default function Profile() {
  function EmptyBankCard() {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="relative">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Bank Details Not Added</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Add your bank details to receive payouts and withdrawals</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100">
            <div className="flex items-start gap-2 sm:gap-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Adding your bank details enables withdrawals and ensures your account is fully verified. This usually takes 1-2 business days to process.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                    Instant setup
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                    Bank-level security
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                    Verified payouts
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <Button size="sm" onClick={()=>setIsBankVerOpen(true)} details="Add Bank Details" variant="secondary" className="w-full sm:w-auto justify-center text-xs sm:text-sm" />
          </div>
        </div>
      </div>
    );
  }

  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { data: session } = useSession();
  const [isBankVerOpen, setIsBankVerOpen] = useState(false);

  // Bank edit state
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankDetails, setBankDetails] = useState<UserData["bank_details"]>({
    bankName: "First Bank of Nigeria",
    accountNumber: "090001991",
    accountName: "John Doe",
    bankCode: "090199",
    subAccountCode: "",
    email: "",
  });
  const [tempBankDetails, setTempBankDetails] = useState<UserData["bank_details"]>(bankDetails);

  const fetchData = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const resp = await FetchProfile(session.user.email);
      if (resp.error) {
        setError(true);
      } else {
        setData(resp);
        if (resp.userData?.full_name) {
          setBankDetails(resp.userData.bank_details || {
            bankName: "First Bank of Nigeria",
            accountNumber: "090001991",
            accountName: "John Doe",
            bankCode: "090199",
          });
        }
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchData();
    }
  }, [session?.user?.email]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBankEdit = () => {
    setTempBankDetails(bankDetails);
    setIsEditingBank(true);
  };

  const handleBankSave = () => {
    setBankDetails(tempBankDetails);
    setIsEditingBank(false);
  };

  const handleBankCancel = () => {
    setTempBankDetails(bankDetails);
    setIsEditingBank(false);
  };

  const method = data?.userData?.method?.toLowerCase() || "google";
  const methodInfo = methodConfig[method] || methodConfig.google;

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-6">
          <div className="h-24 sm:h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-40 sm:h-48 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 sm:h-40 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <CircleAlert className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Failed to load profile
          </h3>
          <p className="text-sm text-gray-500 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  const { userData, kyc } = data;

  return (
    <div className="w-full min-h-screen">
      <BankVerification
        isOpen={isBankVerOpen}
        onClick={() => (window.location.href = "/dashboard/donor?goto=profile")}
        bankName={userData?.bank_details?.bankName}
        accountNumber={userData?.bank_details?.accountNumber}
        subAccountCode=""
        email=""
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-4 sm:space-y-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-200 sm:border-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 sm:border-2">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                )}
              </div>
              {/* KYC Verified Badge */}
              {kyc && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  title="KYC Verified"
                >
                  <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {userData.full_name}
                </h1>
                {kyc && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{userData.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  Joined {formatDate(userData.created_at)}
                </div>
              </div>

              {/* Auth Method Badge */}
              <div className="mt-3 sm:mt-4 flex justify-center sm:justify-start">
                <div
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${methodInfo.bg} ${methodInfo.color}`}
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/80 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    {methodInfo.icon}
                  </span>
                  Signed in with {methodInfo.label}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-3 sm:gap-4"
        >
          {/* Donations Sent */}
          <div className="bg-white border border-gray-200 sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 truncate">
                  Total Donations
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1 truncate">
                  ₦{userData.donations?.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Donations Received */}
          <div className="bg-white border border-gray-200 sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 truncate">
                  Total Received
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1 truncate">
                  ₦{userData.recived?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bank Details Card */}
        {userData.bank_details ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-gray-200 sm:border-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                    Bank Details
                  </h2>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">
                    Your payout information
                  </p>
                </div>
              </div>

              {!isEditingBank ? (
                <button
                  onClick={() => setIsBankVerOpen(true)}
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shrink-0"
                >
                  <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={handleBankSave}
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                  >
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={handleBankCancel}
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 sm:space-y-4">
              {isEditingBank ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">Bank Name</span>
                    <input
                      type="text"
                      value={tempBankDetails?.bankName}
                      onChange={(e) =>
                        setTempBankDetails((prev) => ({
                          ...prev,
                          bankName: e.target.value,
                        }))
                      }
                      className="text-xs sm:text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">Account Number</span>
                    <input
                      type="text"
                      value={tempBankDetails?.accountNumber}
                      onChange={(e) =>
                        setTempBankDetails((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      className="text-xs sm:text-sm font-semibold text-gray-900 font-mono border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">Account Name</span>
                    <input
                      type="text"
                      value={tempBankDetails.accountName}
                      onChange={(e) =>
                        setTempBankDetails((prev) => ({
                          ...prev,
                          accountName: e.target.value,
                        }))
                      }
                      className="text-xs sm:text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">Bank Code</span>
                    <input
                      type="text"
                      value={tempBankDetails.bankCode}
                      onChange={(e) =>
                        setTempBankDetails((prev) => ({
                          ...prev,
                          bankCode: e.target.value,
                        }))
                      }
                      className="text-xs sm:text-sm font-semibold text-gray-900 font-mono border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 shrink-0">Bank Name</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate text-right">
                      {bankDetails.bankName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 shrink-0">Account Number</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 font-mono truncate">
                        {bankDetails.accountNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 shrink-0">Account Name</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate text-right">
                      {bankDetails.accountName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 sm:py-3 gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 shrink-0">SWIFT Code</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 font-mono truncate text-right">
                      {bankDetails.bankCode}
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <EmptyBankCard />
        )}

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-gray-50 border border-gray-200 sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${
                  userData.is_verified ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                Account Status
              </span>
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold shrink-0 ${
                userData.is_verified ? "text-green-700" : "text-amber-700"
              }`}
            >
              {userData.is_verified ? "Active" : "Pending Verification"}
            </span>
          </div>
        </motion.div>

        {/* KYC Verification Card */}
        {!kyc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-amber-50 border border-amber-200 sm:border-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                    Identity Verification Required
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 leading-relaxed">
                    Complete KYC verification to unlock full account features and
                    increase your transaction limits.
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  (window.location.href =
                    "/dashboard/kyc?redir=/dashboard/donor?goto=profile")
                }
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg sm:rounded-xl transition-colors shadow-sm shrink-0"
              >
                Verify Now
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="pt-2 sm:pt-4"
        >
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-red-600 bg-white border border-gray-200 sm:border-2 hover:border-red-200 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}