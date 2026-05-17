import  { useEffect, useState } from "react";
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
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">Bank Details Not Added</h3>
              <p className="text-sm text-gray-500 mt-1">Add your bank details to receive payouts and withdrawals</p>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Adding your bank details enables withdrawals and ensures your account is fully verified. This usually takes 1-2 business days to process.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Instant setup
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Bank-level security
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                    Verified payouts
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button size="md" onClick={()=>setIsBankVerOpen(true)} details="Add Bank Details" variant="secondary" className="w-full sm:w-auto justify-center" />
          </div>
        </div>
      </div>
    )
  }
  



  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { data: session } = useSession();
  const [isBankVerOpen , setIsBankVerOpen] = useState(false);

  // Bank edit state
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankDetails, setBankDetails] = useState<UserData["bank_details"]>({
    bankName: "First Bank of Nigeria",
    accountNumber: "090001991",
    accountName: "John Doe",
   bankCode:"090199",subAccountCode:"",email:""
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
   bankCode:"090199"
  } );
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
    // TODO: Add API call to save bank details
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
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircleAlert className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Failed to load profile
          </h3>
          <p className="text-gray-500 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  const { userData, kyc } = data;

  return (

    <div className="w-full min-h-screen">
      <BankVerification
       isOpen={isBankVerOpen}
       onClick={() => window.location.href = "/dashboard/donor?goto=profile"}
       bankName={userData?.bank_details?.bankName}
       accountNumber={userData?.bank_details?.accountNumber}
       subAccountCode=""
       email=""
       />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden border-2 border-gray-200">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              {/* KYC Verified Badge */}
              {kyc && (
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  title="KYC Verified"
                >
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
              )}

            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.full_name}
                </h1>
                {kyc && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(userData.created_at)}
                </div>
              </div>

              {/* Auth Method Badge */}
              <div className="mt-4 flex justify-center sm:justify-start">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${methodInfo.bg} ${methodInfo.color}`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold">
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
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Donations Sent */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Donations
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {userData.donations.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Donations Received */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Received
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {userData.recived.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bank Details Card */}
            {userData.bank_details ? (  <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Bank Details
                </h2>
                <p className="text-sm text-gray-500">Your payout information</p>
              </div>
            </div>

            {!isEditingBank ? (
              <button
                onClick={() => setIsBankVerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBankSave}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleBankCancel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditingBank ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-2">
                  <span className="text-sm text-gray-500">Bank Name</span>
                  <input
                    type="text"
                    value={tempBankDetails?.bankName}
                    onChange={(e) =>
                      setTempBankDetails((prev) => ({
                        ...prev,
                        bankName: e.target.value,
                      }))
                    }
                    className="text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-2">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <input
                    type="text"
                    value={tempBankDetails?.accountNumber}
                    onChange={(e) =>
                      setTempBankDetails((prev) => ({
                        ...prev,
                        accountNumber: e.target.value,
                      }))
                    }
                    className="text-sm font-semibold text-gray-900 font-mono border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-2">
                  <span className="text-sm text-gray-500">Account Name</span>
                  <input
                    type="text"
                    value={tempBankDetails.accountName}
                    onChange={(e) =>
                      setTempBankDetails((prev) => ({
                        ...prev,
                        accountName: e.target.value,
                      }))
                    }
                    className="text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                  <span className="text-sm text-gray-500">Bank Code</span>
                  <input
                    type="text"
                    value={tempBankDetails.bankCode}
                    onChange={(e) =>
                      setTempBankDetails((prev) => ({
                        ...prev,
                        bankCode: e.target.value,
                      }))
                    }
                    className="text-sm font-semibold text-gray-900 font-mono border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-50"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Bank Name</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {bankDetails.bankName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900 font-mono">
                      {bankDetails.accountNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Account Name</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {bankDetails.accountName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-500">SWIFT Code</span>
                  <span className="text-sm font-semibold text-gray-900 font-mono">
                    {bankDetails.bankCode}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>) : (
<EmptyBankCard />
        )}

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  userData.is_verified ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                Account Status
              </span>
            </div>
            <span
              className={`text-sm font-semibold ${
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
            className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Identity Verification Required
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete KYC verification to unlock full account features and
                    increase your transaction limits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  // TODO: Navigate to KYC verification flow
                  console.log("Navigate to KYC verification");
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm shrink-0"
              >
                Verify Now
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="pt-4"
        >
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-red-600 bg-white border-2 border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}