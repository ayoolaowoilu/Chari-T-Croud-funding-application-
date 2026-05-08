"use server"

import { cookies } from "next/headers"


const setCookie = async(name:string,data:any)=>{
          const cookieStore = await cookies();

          let datatype;
          try{
             datatype =  JSON.parse(data)
          }catch {
               datatype =JSON.stringify(data)
          }
            cookieStore.set(name,datatype,{
            sameSite:"lax",
            maxAge:60 * 60 * 24 * 30,
            secure:false,
            httpOnly:true,

            })
          
}


const getCookie =async (name:string) =>{
    const cookieStore = await cookies();

  const cookie =  cookieStore.get(name)

  return  cookie?.value
}

const deleteCookie =async(name:string) =>{
        const cookieStore = await cookies();
        cookieStore.delete(name)
}


export {
     setCookie,
     getCookie,
     deleteCookie
}