"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { Heart, CreditCard,  Mail, MessageSquare, ChevronRight, Shield, UserCircle, XCircle } from 'lucide-react';
import NavBar from '@/app/components/layout/NavBar';
import { useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { fetchOneCauseById, GetUserDetailsDyId } from '@/app/lib/fetchRequests';
import { DualRingSpinner } from '@/app/components/ui/loading';
import { Campaign } from '@/app/lib/types';
import Footer from '@/app/components/layout/footer';
import PaystackPopup from '@/app/components/paystackpopup';
import Explain from '@/app/components/layout/explain';

    const FEE_PRESETS = [0, 500, 1000,2000,3000,4000 ];


export default function Page(){
    const searchParams = useSearchParams()

    const [campaign,setCampaign] = useState<Campaign | null>(); 
      const [centerCache, setCenterCache] = useState<Record<number, { full_name: string; image: string }>>({});
   const currency = campaign?.currency
   
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


 
    const donationId = searchParams.get("id") as string
     const name = campaign?.name
  
    const [loading , setLoading] = useState(true)
    const { status,data:session } = useSession();
       const platformFee = useMemo(()=>{
          if(amount == "custom"){
               return Number(customAmount) * 0.04
          }else{
               return Number(amount) * 0.04
          }
    },[amount , customAmount])
    const [platFormFee , setPlatformFee] = useState<number>(2000)
    
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

      useEffect(() => {
    if (campaign?.center_id && !centerCache[Number(campaign.center_id)]) {
      const getCenter = async () => {
        try {
          const resp = await GetUserDetailsDyId(Number(campaign.center_id) , true);
         
          if (resp.error) {
            console.error("Failed to fetch center:", resp.error);
            return;
          }
          setCenterCache(prev => ({ ...prev, [campaign.center_id!]: resp }));
        } catch (err) {
          console.error("Error fetching center:", err);
        }
      };
      getCenter();
    }
  }, [campaign?.center_id, centerCache]);
  
  const centerData = centerCache[Number(campaign?.center_id)]
  console.log(centerData , centerCache)


    const remaining  = (Number(campaign?.goal) - Number(campaign?.raised))

  
      if((Number(amount) > remaining) || (Number(customAmount) > remaining) ){
         if(!campaign?.center_id){
              setAmount(String(remaining))
           setCustomAmount(String(remaining)) 
         }    
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
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 md:p-8 mt-13">
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


           {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-4">
              <Heart className="w-3 h-3 fill-current" />
              <span>{campaign.category}</span>
            </div>   */}


            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3 text-gray-900">
              {name} <span className="text-blue-600 font-normal">Mission</span>
            </h1>
          {campaign.center_id &&   <div className="font-semibold text-gray-900 text-sm inline-flex items-center">

                 <div className="rounded-full border border-gray-200 w-6 h-6 overflow-hidden mr-2 inline-flex items-center justify-center shrink-0">
                        <img src={centerData?.image} alt={centerData?.full_name} className="w-6 h-6 rounded-full object-cover" />
                      </div>

                  <Explain
                        topic={centerData?.full_name}
                        details="This is a charity center profile"
                        link={`/dashboard/centers/profile?id=${campaign?.center_id}`}
                        link_details={"View profile"}
                      />

                       <span 
                        className=" ml-2 inline-flex items-center transition-transform duration-300 hover:scale-110" 
                        title="Verified Charity"
                    >
                        <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                    </span>

            </div>}



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


           {
           
       

<div className="space-y-3">
  <div className="flex items-center justify-between">
    <small className="text-gray-500 text-xs font-medium uppercase tracking-wider">Support Chari-T</small>
    {platFormFee > 0 && (
      <span className="text-xs text-emerald-600 font-medium">
        Campaign gets ₦{amount == "custom" ? Number(customAmount) : Number(amount) }
      </span>
    )}
  </div>
  
  <div className="flex flex-wrap gap-2">
    {FEE_PRESETS.map((fee) => (
      <button
        key={fee}
        type="button"
        onClick={() => setPlatformFee(fee)}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${platFormFee === fee
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
            : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
          }
        `}
      >
        {fee === 0 ? 'None' : `₦${fee}`}
      </button>
    ))}
  </div>
  
  {/* Custom amount option */}
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
    <input
      type="number"
    
      placeholder="Custom amount"
      value={!FEE_PRESETS.includes(platFormFee) ? platFormFee || '' : ''}
      onChange={(e) => {
        const val = Number(e.target.value);
       
        setPlatformFee(Math.abs(Number(val)));
      }}
      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
    />
  </div>
  
  <p className="text-xs text-gray-400">
    {platFormFee > 0 
      ? `₦${platFormFee.toLocaleString()} helps us maintain the platform. Campaign receives ₦${(amount == "custom" ? Number(customAmount) : Number(amount) ).toLocaleString()}.`
      : "Optional — 100% of your donation goes to the campaign."
    }
  </p>
</div>}


               
    
             
                 <PaystackPopup 
      email={session?.user.email || formData.email}
      publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
      subaccount={campaign.bank_details.subAccountCode}
      onSuccess={()=>{console.log("success popup opened")}}
      onCancel={()=>{console.log("popup canceled")}}
      amount={amount == "custom" ? Number(customAmount) + platformFee : Number(amount) + platFormFee}
      metadata={{
    custom_fields: [{
      display_name: 'Order ID',
      variable_name: 'order_id',
      value: '12345'
    }]
  }}
  platform_fee={platFormFee}
  name={isBlind ? null : status == "authenticated" ? session.user.name : formData.name}
  isBlind={isBlind}
  isAuthed={status == "authenticated"}
  homeUrl='/causes/get'
  causesUrl='/causes/get'
  id={campaign.id}
  owner_id={campaign.user_id}
  donor_name={formData.name}
  message={formData.message}
  center_id={campaign.center_id ? campaign.center_id : null}
  
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
