
interface opp{
     mm?:boolean
}
const LoadingCards:React.FC<opp> = ({mm}) => {

    if(mm){
          return   <div  className="bg-white rounded-2xl shadow-lg md:w-4/5 mx-auto overflow-hidden animate-pulse">
                    {/* Image skeleton */}
                    <div className="h-48 bg-gray-200" />
                    
                    {/* Content skeleton */}
                    <div className="p-6 space-y-4">
                        {/* Category badge */}
                        <div className="w-20 h-6 bg-gray-200 rounded-full" />
                        
                        {/* Title */}
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        
                        {/* Description lines */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                        
                        {/* Progress bar */}
                        <div className="pt-2">
                            <div className="flex justify-between mb-2">
                                
                                <div className="w-16 h-4 bg-gray-200 rounded" />
                            </div>
                            <div className="h-2.5 bg-gray-200 rounded-full" />
                            <div className="mt-2 w-24 h-3 bg-gray-200 rounded" />
                        </div>
                        
                       
                    </div>
                </div>

    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 mx-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg  overflow-hidden animate-pulse">
                    {/* Image skeleton */}
                    <div className="h-48 bg-gray-200" />
                    
                    {/* Content skeleton */}
                    <div className="p-6 space-y-4">
                        {/* Category badge */}
                        <div className="w-20 h-6 bg-gray-200 rounded-full" />
                        
                        {/* Title */}
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        
                        {/* Description lines */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                        
                        {/* Progress bar */}
                        <div className="pt-2">
                            <div className="flex justify-between mb-2">
                                
                                <div className="w-16 h-4 bg-gray-200 rounded" />
                            </div>
                            <div className="h-2.5 bg-gray-200 rounded-full" />
                            <div className="mt-2 w-24 h-3 bg-gray-200 rounded" />
                        </div>
                        
                       
                    </div>
                </div>
            ))}
        </div>
    );
}



export default LoadingCards