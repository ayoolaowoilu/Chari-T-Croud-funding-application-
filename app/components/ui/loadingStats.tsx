export default function LS(){
       return(
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 mx-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg  overflow-hidden animate-pulse">
                 
                    <div className="p-6 space-y-4">
                     
                                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                        
        
         
                        <div className="pt-2">
                            <div className="flex justify-between mb-2">
                                
                                <div className="w-16 h-4 bg-gray-200 rounded" />
                            </div>
                            
                        </div>
                        
                       
                    </div>
                </div>
            ))}
        </div>
       )
}