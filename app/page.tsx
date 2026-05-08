"use client"
import Mission from "./components/landing/Mission";
import Slider from "./components/landing/slider";
import FeaturedCauses from "./components/landing/causes";
import WhyChooseUs from "./components/landing/WCU";
import NavBar from "./components/layout/NavBar";
import BlindDonations from "./components/landing/blindDonations";
import Footer from "./components/layout/footer";

export default function Home() {
  return (
      <>  

       <header>
             <NavBar />
       </header>
              <main>
                    <Slider />
                    <Mission />
                    <FeaturedCauses />
                    <WhyChooseUs />
                    <BlindDonations />
              </main>
        
          <Footer />
      </>
  );
}
 