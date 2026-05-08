

import { Lock, Mail, Search, User, UserCircle } from "lucide-react";
import Button from "../ui/button";
import SocialButtons from "./socialButtons";
import { useState } from "react";
import { DualRingSpinner } from "../ui/loading";


export default function LoginForm(){
      const [loading , setLoading] = useState(false);

    return(
         <div className="">
            
        {loading ? (
              <div className="p-6 pt-10 mx-auto  h-100 my-auto w-full rounded  flex flex-col items-center bg-white">
                <DualRingSpinner  />
                <div className="mx-auto text-gray-600">
                     logging in...
                </div>

                </div>
        ) : (
               <div className="p-6 mx-auto my-auto w-full  rounded h-lg   bg-white mt-10">
                    {/* <div className="mt-4 text-2xl font-bold text-gray-700">
                          Login Form
                    </div>
                    <small className="text-xs text-gray-500 mb-4">Impact Lives</small>

                     <div className="relative w-full mt-4">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Input Email Address "
                            />
                        </div>

                          <div className="relative w-full mt-4">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                
                                type="password"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Input Password "
                            />
                        </div>

                        <Button className="mt-4 w-full" details="Sign In" variant="secondary" size="md" /> */}

                          {/* <div className="flex mt-4 justify-center text-gray-500">
                          Or continue with
                          </div> */}

                                <SocialButtons />

                    </div>
        )}
            </div>
  
    )
}