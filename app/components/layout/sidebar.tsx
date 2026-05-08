import { BookDashedIcon, CircleQuestionMark, HandHeart, House, PersonStandingIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import Button from "../ui/button";

interface SideBarProps {
  show: boolean;
  isAuthenticated:boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ show, onClose , isAuthenticated }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed z-50 w-screen h-screen top-0 inset-0 bg-black/40 backdrop-blur-sm">

      <div ref={sidebarRef} className="fixed  flex flex-col top-0 left-0 h-screen p-4 bg-white md:w-lg w-64">

        <div className="p-4 text-2xl text-black ">Menu</div>
        <ul className="space-y-4 text-white">
         {isAuthenticated && ( <li onClick={()=>window.location.href = "/dashboard/donor"} className="p-4 rounded text-gray-700 flex space-x-2 bg-gray-200 "><House /> <span className="my-auto">Dashboard</span></li>)}
           <li onClick={()=>window.location.href = "/startcauses"} className="p-4 rounded text-gray-700 flex space-x-2 bg-gray-200 "><BookDashedIcon /> <span className="my-auto">Start Cause</span></li>
            <li onClick={()=>window.location.href = "/causes/get"} className="p-4 rounded text-gray-700 flex space-x-2 bg-gray-200 "><HandHeart /> <span className="my-auto">View Causes</span></li>
          <li onClick={()=>window.location.href = "/dashboard/donor"} className="p-4 rounded text-gray-700 flex space-x-2 bg-gray-200"><PersonStandingIcon /> <span className="my-auto">Why us?</span></li>
          <li onClick={()=>window.location.href = "/dashboard/donor"} className="p-4 rounded text-gray-700 flex space-x-2 bg-gray-200"><CircleQuestionMark /> <span className="my-auto">Faq's</span></li>
         
        </ul>


        {!isAuthenticated && (<div className="mt-20">
          <Button variant="secondary" size="lg" details="Sign up" />
        </div>)}


      </div>
    </div>
  );
};

export default SideBar;