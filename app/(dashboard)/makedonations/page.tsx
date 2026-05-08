"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { Heart, CreditCard,  Mail, MessageSquare, ChevronRight, Shield, UserCircle, XCircle } from 'lucide-react';
import NavBar from '@/app/components/layout/NavBar';
import { useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { fetchOneCauseById } from '@/app/lib/fetchRequests';
import { DualRingSpinner } from '@/app/components/ui/loading';
import { Campaign } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import PaystackPopup from '@/app/components/paystackpopup';



export default function Page(){
    const searchParams = useSearchParams()

    const [campaign,setCampaign] = useState<Campaign | null>(); 

    const donationId = searchParams.get("id") as string
     const name = campaign?.name
     const currency = campaign?.currency
    const [loading , setLoading] = useState(true)
    const { status,data:session } = useSession();
    
    const fetchData = async()=>{
       try{
        setLoading(true)
            const data = await fetchOneCauseById(Number(donationId),0)
        
             setAmount("1000")
              setCampaign(data)
       }catch(error){
          console.log(error)
       }finally{
            setLoading(false)
       };
       

    }

    document.title = "Donate | " + name

    useEffect(()=>{
       fetchData()
    },[])
  
  const presetAmounts = useMemo(()=>{
     if(currency === "NG"){
    return  ['1000', '5000', '10000', '250000', '500000']  }else {
     return ['25', '50', '100', '250', '500'];}
  },[currency])
    const [amount, setAmount] = useState<string>(presetAmounts[0]);

    const [customAmount, setCustomAmount] = useState<string>('');

    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
    });
    const remaining  = (Number(campaign?.goal) - Number(campaign?.raised))
    const platformFee = useMemo(()=>{
          if(amount == "custom"){
               return Number(customAmount) * 0.04
          }else{
               return Number(amount) * 0.04
          }
    },[amount , customAmount])
  
      if((Number(amount) > remaining) || (Number(customAmount) > remaining) ){
           setAmount(String(remaining))
           setCustomAmount(String(remaining))     
    }

  const handleAmountSelect = (val: string) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    setAmount('custom');
  };



  const [isBlind , setIsBlind] = useState(false)

    if(loading){
        return(
            <div className='w-screen h-screen bg-white'>
                  <NavBar />

                  <div className="mt-30 mb-70">
                      <DualRingSpinner />
                  </div>

                  <Footer />
            </div>
        )
    }

    if (!campaign) {
    return (
   <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <NavBar />
         <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={20} color="red"  />
           
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign not found!</h2>
          <p className="text-gray-600"> Thank you for your support!</p>
        </div>
    
      </div>
          <Footer />
   </>
    );
  }else{
        return (
  <>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 md:p-8 mt-14">
      <NavBar />
  
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Image Section */}
        <div className="relative order-2 lg:order-1">
          <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-blue-50 via-white to-gray-100 border border-gray-200 shadow-xl shadow-gray-200/50">
            {/* Image */}
            <img 
              src="/slider1/medium-shot-boys-hugging.jpg" 
              alt="Digital unity concept" 
              className="w-full h-100 lg:h-150 object-cover opacity-90 hover:opacity-100 transition-all duration-700"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-light mb-2 text-gray-900">Make an Impact</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your contribution powers innovation and helps build a better future for communities worldwide.
                </p>
                <div className="flex items-center gap-2 mt-4 text-blue-600 text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Encrypted</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-6 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Right Side - divSection */}
        <div className="order-1 lg:order-2 w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">


           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-4">
              <Heart className="w-3 h-3 fill-current" />
              <span>{campaign.category}</span>
            </div>  


            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3 text-gray-900">
              {name} <span className="text-blue-600 font-normal">Mission</span>
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Join thousands of supporters making a difference. Every contribution brings us closer to our goal.
            </p>
          </div>

          <div className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountSelect(amt)}
                    className={`
                      relative py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200
                      ${amount === amt && customAmount === '' 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    {currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}{amt}
                  </button>
                ))}
              </div>
              
           
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">  {currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className={`
                    w-full bg-white border rounded-xl py-3 pl-8 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all
                    ${amount === 'custom' 
                      ? 'border-blue-500 ring-2 ring-blue-100' 
                      : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
                    }
                  `}
                />
              </div>
            </div>

            <div className="space-y-4">
            
            <div>
    <small className="text-gray-500 text-xs">DONATE ANONYMOUSLY</small>
    <div onClick={() => setIsBlind(!isBlind)} className="cursor-pointer">
        {!isBlind ? (
            <svg width="35" height="20" viewBox="0 0 35 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="35" height="20" rx="10" fill="#D1D5DB"/>
                <circle cx="10" cy="10" r="8" fill="white"/>
            </svg>
        ) : (
            <svg width="35" height="20" viewBox="0 0 35 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="35" height="20" rx="10" fill="#3B82F6"/>
                <circle cx="25" cy="10" r="8" fill="white"/>
            </svg>
        )}
    </div>
</div>


           
                 <div className='space-y-2'>
 {(!isBlind && status == "unauthenticated") && (

                              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><UserCircle size={15} /></span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`
                    w-full bg-white border rounded-xl py-3 pl-8 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all
                    ${amount === 'custom' 
                      ? 'border-blue-500 ring-2 ring-blue-100' 
                      : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
                    }
                  `}
                />
              </div>

                   )}

                   
                    {status !== "authenticated" && (
                      
                      <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={15} /></span>
                <input
                  type="text"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`
                    w-full bg-white border rounded-xl py-3 pl-8 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all
                    ${amount === 'custom' 
                      ? 'border-blue-500 ring-2 ring-blue-100' 
                      : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
                    }
                  `}
                />
              </div>
                    ) }
                 </div>
       

            {/* <div className="p-4 rounded-xl my-4 shadow-xl bg-white border-gray-200 border">
                     <div className="text-gray-500 text-xs">AMOUNT : {amount === 'custom' ? customAmount ? `${currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}${customAmount}` : '' : `${currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}${amount}`}</div>
                  <div className="mb-1 text-gray-500 text-xs">SERVICES FEE(4%): {currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}{platformFee}</div>
                  <div className="text-gray-500 text-xs">TOTAL : {amount === 'custom' ? Number(customAmount) + platformFee ? `${currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}${Number(customAmount) + platformFee}` : '' : `${currency == "NG" ? "₦" : currency == "USD" ? "$" : "£"}${Number(amount) + platformFee}`}</div>

            </div> */}

              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <textarea
                  placeholder="Leave a message (optional)"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                />
              </div>
            </div>

             
                 <PaystackPopup 
      email={session?.user.email || formData.email}
      publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
      subaccount={campaign.bank_details.subAccountCode}
      onSuccess={()=>{console.log("succecc popup opned")}}
      onCancel={()=>{console.log("popup cancled")}}
      amount={amount == "custom" ? Number(customAmount) : Number(amount) }
      metadata={{
    custom_fields: [{
      display_name: 'Order ID',
      variable_name: 'order_id',
      value: '12345'
    }]
  }}
  name={isBlind ? null : status == "authenticated" ? session.user.name : formData.name}
  isBlind={isBlind}
  isAuthed={status == "authenticated"}
  homeUrl='/causes/get'
  causesUrl='/causes/get'
  id={campaign.id}
  owner_id={campaign.user_id}
  donor_name={formData.name}
  message={formData.message}
  
      />


       

            <p className="text-center text-gray-500 text-xs">
              Secure payment processing. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
     
    </div>
    <Footer />
  </>
  );
    }
};
