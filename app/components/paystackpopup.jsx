'use client';
import PaystackPop from '@paystack/inline-js';
import { ChevronRight, CreditCard, CheckCircle, XCircle, Home, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
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
  causesUrl = '/causes/get',id,isAuthed,name,isBlind,owner_id,donor_name,message
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  const handlePayment = () => {
    if (!publicKey) {
      setError('Payment configuration error: Missing public key');
      return;
    }
    if (!email) {
      setError('Please provide an email address');
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
        first_name:name?.split(" ")[0] || "Unknown user",
        last_name:name?.split(" ")[1] || "Unknown user",
        amount: amount * 100,
        subaccount: subaccount,
        metadata: metadata || {
          custom_fields: [{
            display_name: 'Cart ID',
            variable_name: 'cart_id',
            value: '8393',
          }]
        },
        onSuccess: async(trx) => {
             try{
              const payload = {
                        campaign_id:id,
                        isAuthed:isAuthed,
                        email:email,
                        isBlind:isBlind,
                        name:name,
                        owner_id:owner_id,
                        amount:amount,
                        transaction_id:trx.reference,
                        donor_name:donor_name,
                        message:message
              }
                const resp = await updateDonate(payload)
                if(resp.error){
                    setError("Payment successful but , has not been recorded")
                    
        
                    localStorage.setItem("pending_donations",JSON.stringify({reference:trx.reference,id:id}))
                }
                 setTransaction(trx);
                  setStatus('success');
                  localStorage.removeItem("pending_donations")
                     setLoading(false);
                 console.log('Payment successful:', trx);
          if (onSuccess) onSuccess(trx);
             }catch(error){
                setError("Error Updating donations")
                 localStorage.setItem("pending_donations",JSON.stringify({reference:trx.reference,id:id}))
             }

       


        
       
        },
        onCancel: () => {
          setLoading(false);
          setStatus('cancelled');
          console.log('Payment cancelled by user');
          if (onCancel) onCancel();
        },
        onLoad: (response) => {
          console.log('Paystack loaded:', response);
        },
        onError: (error) => {
          setLoading(false);
          console.error('Paystack error:', error);
          setError(error.message || 'Payment failed. Please try again.');
        }
      });

    } catch (err) {
      setLoading(false);
      console.error('ERROR:', err);
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

  const resetPayment = () => {
    setStatus('idle');
    setTransaction(null);
    setError(null);
  };

 
  const SuccessCard = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-emerald-500 px-6 py-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
          <p className="text-emerald-100 mt-1">Thank you for your donation</p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Amount Paid</span>
              <span className="text-lg font-bold text-slate-900">
                ₦{transaction?.amount ? (transaction.amount / 100).toLocaleString() : amount?.toLocaleString()}
              </span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Reference</span>
              <button 
                onClick={copyReference}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {transaction?.reference || 'N/A'}
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Email</span>
              <span className="text-sm font-medium text-slate-900">{email}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Completed
              </span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Date</span>
              <span className="text-sm font-medium text-slate-900">
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
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a 
              href={causesUrl}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              View More Causes
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href={homeUrl}
              className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </a>
            <button
              onClick={resetPayment}
              className="w-full text-slate-400 hover:text-slate-600 text-sm font-medium py-2 transition-colors"
            >
              Make Another Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

 
  const CancelledCard = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-amber-500 px-6 py-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Cancelled</h2>
          <p className="text-amber-100 mt-1">You closed the payment window</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Attempted Amount</span>
              <span className="text-lg font-bold text-slate-900">₦{amount?.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Email</span>
              <span className="text-sm font-medium text-slate-900">{email}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Cancelled
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-500 text-center">
            No money was deducted from your account. You can try again whenever you are ready.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={resetPayment}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Try Again
            </button>
            <a 
              href={homeUrl}
              className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors"
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
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="group relative w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 disabled:shadow-none overflow-hidden"
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
              Donate ₦{amount?.toLocaleString()}
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