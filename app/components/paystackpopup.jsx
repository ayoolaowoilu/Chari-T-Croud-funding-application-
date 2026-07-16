'use client';
import PaystackPop from '@paystack/inline-js';
import { 
  ChevronRight, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Home, 
  ArrowRight, 
  Copy, 
  Check,
  Receipt,
  Wallet,
  Download,
  Calendar,
  Mail,
  Hash,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  User,
  Tag
} from 'lucide-react';
import { useState, useRef } from 'react';
import { updateDonate } from '../lib/fetchRequests';

export default function PaystackPopup({ 
  email, 
  amount, 
  subaccount, 
  publicKey,
  onSuccess, 
  onCancel,
  metadata,
  homeUrl = '/',
  causesUrl = '/causes/get',
  id,
  isAuthed,
  name,
  isBlind,
  owner_id,
  donor_name,
  message,
  center_id,
  platform_fee = 0,
  bearer = 'account'
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef(null);

  const safePlatformFee = Number(platform_fee) || 0;
  const safeAmount = Number(amount) || 0;
  const netToCampaign = safeAmount - safePlatformFee;

  const handlePayment = () => {
    if (!publicKey) {
      setError('Payment configuration error: Missing public key');
      return;
    }
    if (!email) {
      setError('Please provide an email address');
      return;
    }
    if (!amount || safeAmount <= 0) {
      setError('Invalid donation amount');
      return;
    }
    if (safePlatformFee >= safeAmount) {
      setError('Platform fee cannot be equal to or greater than the donation amount');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('idle');

    try {
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email: email,
        first_name: name?.split(" ")[0] || "Unknown user",
        last_name: name?.split(" ")[1] || "Unknown user",
        amount: safeAmount * 100,
        transaction_charge: safePlatformFee * 100,
        subaccount: subaccount,
        bearer: bearer,
        metadata: metadata || {
          campaign_id: id,
          center_id: center_id || undefined,
          platform_fee: safePlatformFee,
          isBlind: Boolean(isBlind),
          donor_name: donor_name || name || undefined,
          custom_fields: [
            {
              display_name: 'Campaign ID',
              variable_name: 'campaign_id',
              value: String(id ?? ''),
            },
            {
              display_name: 'Platform Fee',
              variable_name: 'platform_fee',
              value: String(safePlatformFee),
            },
            {
              display_name: 'Blind',
              variable_name: 'is_blind',
              value: String(Boolean(isBlind)),
            },
          ],
        },
        onSuccess: async (trx) => {
          try {
            const payload = {
              campaign_id: id,
              isAuthed: isAuthed,
              email: email,
              isBlind: isBlind,
              name: name,
              owner_id: owner_id,
              amount: netToCampaign,
              platform_fee: safePlatformFee,
              total_amount: safeAmount,
              transaction_id: trx.reference,
              donor_name: donor_name,
              message: message,
              center_id: center_id
            };

            const resp = await updateDonate(payload);

            setTransaction(trx);
            setStatus('success');
            setLoading(false);

            if (resp?.error) {
              setError(
                resp.error ||
                  "Payment went through, but we could not record the donation. Keep your reference for support."
              );
              localStorage.setItem(
                "pending_donations",
                JSON.stringify({
                  reference: trx.reference,
                  id: id,
                  payload: payload,
                })
              );
            } else {
              localStorage.removeItem("pending_donations");
            }

            if (onSuccess) onSuccess(trx);
          } catch (error) {
            setError("Error recording donation");
            localStorage.setItem("pending_donations", JSON.stringify({
              reference: trx.reference,
              id: id
            }));
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
          setStatus('cancelled');
          if (onCancel) onCancel();
        },
        onLoad: (response) => {
          console.log('Paystack loaded:', response);
        },
        onError: (error) => {
          setLoading(false);
          setError(error.message || 'Payment failed. Please try again.');
        }
      });

    } catch (err) {
      setLoading(false);
      setError('Something went wrong: ' + (err.message || err));
    }
  };

  const copyReference = () => {
    if (transaction?.reference) {
      navigator.clipboard.writeText(transaction.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadReceipt = () => {
    if (!receiptRef.current) return;

  
    const url = `${window.location.origin}/api/receipts?email=${email}&amount=${amount}&platform_fee=${platform_fee}&time=${new Date().toLocaleDateString('en-NG', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}&transaction_id=${transaction?.reference}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `chari-t-receipt-${transaction?.reference || 'donation'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetPayment = () => {
    setStatus('idle');
    setTransaction(null);
    setError(null);
  };

  const SuccessCard = () => (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen flex flex-col">

        {/* Top Status Bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 text-sm">Payment Confirmed</span>
          </div>
          <span className="text-gray-400 text-sm">{transaction?.reference}</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8 sm:px-10 sm:py-12 max-w-2xl mx-auto w-full">

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-2">Thank You</h1>
            <p className="text-gray-500">Your donation has been received</p>
          </div>

          {/* Amount Card */}
          <div ref={receiptRef} className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8 shadow-sm">

            {/* Amount Header */}
            <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-100">
              <p className="text-gray-500 text-sm mb-2">Total Amount Paid</p>
              <p className="text-4xl text-gray-900">₦{safeAmount.toLocaleString()}</p>
            </div>

            {/* Breakdown */}
            <div className="p-6 space-y-4">

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm">Donation</p>
                    <p className="text-gray-400 text-xs">Base contribution</p>
                  </div>
                </div>
                <p className="text-gray-900">₦{netToCampaign.toLocaleString()}</p>
              </div>

              {safePlatformFee > 0 && (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm">Platform Fee</p>
                      <p className="text-gray-400 text-xs">Supports Chari-T</p>
                    </div>
                  </div>
                  <p className="text-amber-600">₦{safePlatformFee.toLocaleString()}</p>
                </div>
              )}

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-emerald-700 text-sm">Net to Campaign</p>
                    <p className="text-gray-400 text-xs">What the cause receives</p>
                  </div>
                </div>
                <p className="text-emerald-600 text-lg">₦{netToCampaign.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-400 text-sm uppercase mb-4">Transaction Details</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">Reference</span>
                </div>
                <button 
                  onClick={copyReference}
                  className="flex items-center gap-2 text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  {transaction?.reference || 'N/A'}
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <span className="text-gray-900 text-sm">{email}</span>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Donor</span>
                </div>
                <span className="text-gray-900 text-sm">{donor_name || name || 'Anonymous'}</span>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Date</span>
                </div>
                <span className="text-gray-900 text-sm">
                  {new Date().toLocaleDateString('en-NG', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Status</span>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={downloadReceipt}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>

            <a 
              href={causesUrl}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl transition-colors text-sm"
            >
              View More Causes
              <ArrowRight className="w-4 h-4" />
            </a>

            <a 
              href={homeUrl}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </a>

            <button
              onClick={resetPayment}
              className="w-full text-gray-400 hover:text-gray-600 text-sm py-3 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Make Another Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CancelledCard = () => (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen flex flex-col">

        {/* Top Status Bar */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-600 text-sm">Payment Cancelled</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8 sm:px-10 sm:py-12 max-w-2xl mx-auto w-full">

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-2">Payment Cancelled</h1>
            <p className="text-gray-500">No charges were applied to your account</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-400 text-sm uppercase mb-4">Payment Summary</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Receipt className="w-4 h-4" />
                  <span className="text-sm">Attempted Amount</span>
                </div>
                <span className="text-gray-900 text-sm">₦{safeAmount.toLocaleString()}</span>
              </div>

              {safePlatformFee > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm">Platform Fee</span>
                    </div>
                    <span className="text-gray-400 text-sm">₦{safePlatformFee.toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <span className="text-gray-900 text-sm">{email}</span>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Status</span>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-100">
                  <XCircle className="w-3 h-3" />
                  Cancelled
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
            <p className="text-gray-500 text-sm text-center">
              Your payment was not processed. You can try again or browse other causes to support.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={resetPayment}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl transition-colors text-sm"
            >
              <CreditCard className="w-4 h-4" />
              Try Again
            </button>

            <a 
              href={causesUrl}
              className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl transition-colors text-sm"
            >
              Browse Other Causes
              <ArrowRight className="w-4 h-4" />
            </a>

            <a 
              href={homeUrl}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-3 relative">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* DARK donation stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Donation Amount</span>
          <span className="text-white">₦{safeAmount.toLocaleString()}</span>
        </div>
        {safePlatformFee > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-500">Platform Fee</span>
              <span className="text-amber-400">₦{safePlatformFee.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-800" />
            <div className="flex justify-between">
              <span className="text-slate-400">Campaign Receives</span>
              <span className="text-emerald-400">₦{netToCampaign.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="group relative w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 disabled:shadow-none overflow-hidden"
      >
        <div className={`absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full ${!loading ? 'group-hover:translate-x-full' : ''} transition-transform duration-1000`} />
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Donate ₦{safeAmount.toLocaleString()}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>

      {status === 'success' && <SuccessCard />}
      {status === 'cancelled' && <CancelledCard />}
    </div>
  );
}