import { motion } from "framer-motion";
import { CheckCircleIcon, Info, MessageCircleWarning } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface NotProp {
  message: string;
  status: "success" | "error" | "warning";
}

const Notification: React.FC<NotProp> = ({ message, status }) => {
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(true);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    if (timer >= 10) {
      setActive(false);
    }
  }, [timer]);


  const progressWidth = (timer / 10) * 100;

  const render = useCallback(() => {
    return (
      <motion.div
        initial={{ y: "-100px", opacity: 0 }}
        animate={{ y: "0px", opacity: 1 }}
        exit={{ y: "-100px", opacity: 0 }}
        className="fixed z-50 top-10  bg-gray-900 p-4 rounded-sm flex space-x-4 min-w-[300px]  overflow-hidden"
      >
        {status === "error" ? (
          <Info color="red" size={20} />
        ) : status === "success" ? (
          <CheckCircleIcon color="lightgreen" size={20} />
        ) : (
          <MessageCircleWarning color="yellow" size={20} />
        )}

        <div className="text-white text-sm">{message}</div>

        <div
          className="absolute left-0 bottom-0 h-1 bg-green-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressWidth}%` }}
        />
      </motion.div>
    );
  }, [timer, status, message, progressWidth]);

  if (!active) return null;
  return render();
};

export default Notification;