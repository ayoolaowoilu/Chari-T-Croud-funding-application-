import { ImageResponse } from 'next/og';


type receipts = {
     amount:number,
     platform_fee:number,
     transaction_id:string,
     time:string, 
     email:string
}


export function Receipts(data:receipts){
     const ChariTLogo = ({ size = 40 }: { size?: number }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }}>
    <div style={{
      width: size,
      height: size,
      background: '#111111',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        color: '#ffffff',
        fontSize: size * 0.5,
        fontWeight: 900,
        fontFamily: 'system-ui',
      }}>C</span>
    </div>
    <span style={{
      fontSize: size * 0.55,
      fontWeight: 800,
      color: '#111111',
      letterSpacing: -0.5,
      fontFamily: 'system-ui',
    }}>Chari-T</span>
  </div>
);


    const ReceiptElement = () => {
          return <div   style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative',
  }}> 
                       <div className="rounded-xl p-4 bg-gray-500 text-2xl text-black">
                              <div className="mx-auto"><ChariTLogo /></div>
                             
                             <div className="flex-col flex space-y-1">
                                   <div className="bg-white rounded-t-xl py-2 px-4"> 
                                          AMOUNT : {data.amount}
                                   </div>
                                    <div className="bg-white py-2 px-4"> 
                                          amount : {data.amount}
                                   </div>
                                     <div className="bg-white py-2 px-4"> 
                                          amount : {data.amount}
                                   </div>  <div className="bg-white py-2 px-4"> 
                                          amount : {data.amount}
                                   </div>

                             </div>
                              
                       </div>
          </div>
    }

    return new ImageResponse(
          <ReceiptElement />,{
             width:1200,
             height:900
          }
    )
}