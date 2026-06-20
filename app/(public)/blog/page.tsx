"use client"

import Explain from "@/app/components/layout/explain";
import { Logo } from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";
import Button from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, MessageCircleCode, Timer } from "lucide-react";
import { useCallback } from "react";


const DUMMY_BLOG_CARDS = [
      {
        topic:"New years eve with chari-t",
        description:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        likes:0,
        comments:0,
        min_read:5,
        story:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        img_url:"https://picsum.photos/seed/${ceer.name}-banner/1584/396"

      },  {
        topic:"New years eve with chari-t",
        description:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        likes:0,
        comments:0,
        min_read:5,
        story:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        img_url:"https://picsum.photos/seed/${center.name}-banner/1584/396"

      },  {
        topic:"New years eve with chari-t",
        description:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        likes:0,
        comments:0,
        min_read:5,
        story:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        img_url:"https://picsum.photos/seed/${centname}-banner/1584/396"

      },  {
        topic:"New years eve with chari-t",
        description:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        likes:0,
        comments:0,
        min_read:5,
        story:"      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
        img_url:"https://picsum.photos/seed/${444}-banner/1584/396"

      }
]
type Cards =  {
    topic : string,
    description:string,
    likes:number,
    comments:number,
    min_read:number,
    story:string,
    img_url:string
};
export default function Page(){

const blog_cards = useCallback((cards:Cards) =>{
     return <div   className="w-full  mb-4 text-black shadow-xl rounded flex flex-col bg-white ">
 
        <div className="w-full h-40">
               <img className="object-cover w-full h-full " src={cards.img_url} alt={cards.topic} />
        </div>
        <div className="p-4">
               <div className="font-bold text-2xl line-clamp-2 mb-3">
                    {cards.topic}
               </div>
               <div className="text-xs flex justify-start gap-2 mb-3">
                  <div className="rounded-full w-6 h-6 border-2 border-gray-600 overflow-hidden">
                      <img src="https://picsum.photos/seed/${444}-banner/1584/396" alt="" className="object-cover w-full h-full" />
                  </div>
                  <div className="text-gray-700 my-auto"> <Explain details="A Croud funding application" topic="Chari-T" /></div>
                   <span 
                        className="inline-flex items-center transition-transform duration-300 hover:scale-110 my-auto" 
                        title="Verified Charity"
                    >
                        <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                    </span>
               </div>
               <div className="text-gray-700 text-sm mb-3 line-clamp-4">
                  {cards.description}
               </div>

               <div className="flex justify-start gap-4">
                      <div className="flex text-gray-700 text-sm gap-2"><Heart size={20} /> {Math.floor(Math.random()*10000)}</div>
                      <div className="flex text-gray-700 text-sm gap-2"> <MessageCircleCode  size={20} /> {Math.floor(Math.random()*300)} </div>
                      <div className="flex text-gray-700 text-sm gap-2"> <Timer size={20} /> {cards.min_read} mins read</div>
               </div>
               <Button className="mt-4" details={<span className="flex gap-2">View More <ChevronRight /></span>} variant="secondary"  />
        </div>
         
     </div>
},[])

  return (
  <div className="min-h-screen bg-white">
         <NavBar />
          <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    
               
                    <div className="mb-8">
                        <h1 className="text-3xl flex gap-2 font-bold text-gray-900 mb-2">
                        
                         <Logo />  Blog Posts 
                        </h1>
                        <p className="text-gray-500">

                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui possimus culpa, cupiditate officia expedita saepe dicta modi. Aut numquam asperiores sunt iure molestiae atque dolorem facere, debitis animi laborum quas.
                        </p>
                    </div>
                    </div>
                            <div className="flex-col flex md:flex-row md:flex-2 lg:flex-3  gap-4">

                          {DUMMY_BLOG_CARDS.map((cards,index)=>{
                               return <div key={index}>
                                  { blog_cards(cards)}
                               </div>
                          })}
                    </div>


                         
          <div className="flex items-center justify-center gap-2 mt-12 mb-6">
            <button
           
     
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium
                         border border-gray-200 bg-white text-gray-700
                         hover:bg-gray-50 hover:border-gray-300
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                         transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex items-center gap-1.5 px-2">

         
                <>
                  <button
                  
                    className="w-10 h-10 rounded-xl text-sm font-medium
                               border border-gray-200 bg-white text-gray-600
                               hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    1
                  </button>
                  
                    <span className="px-1 text-gray-400 text-sm">...</span>
              
                </>
              

      
                <button
                
                  className="w-10 h-10 rounded-xl text-sm font-medium
                             border border-gray-200 bg-white text-gray-600
                             hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  3
                </button>
              )

              <button
                className="w-10 h-10 rounded-xl text-sm font-medium
                           border border-gray-900 bg-gray-900 text-white
                           shadow-sm transition-all duration-200"
              >
                1
              </button>

          
                <button
                
                  className="w-10 h-10 rounded-xl text-sm font-medium
                             border border-gray-200 bg-white text-gray-600
                             hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                   2
                </button>
              
            </div>

            <button
         
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium
                         border border-gray-200 bg-white text-gray-700
                         hover:bg-gray-50 hover:border-gray-300
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                         transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>
        
                    </main>

                   


  </div>
  )

}