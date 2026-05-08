interface Btt {
    details?: string | React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<Btt> = ({ 
    details = "Button", 
    onClick, 
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = ""
}) => {
    const baseStyles = "rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
        secondary: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-800",
        outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500"
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg"
    };

    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
        >
            {details}
        </button>
    );
};

export default Button;