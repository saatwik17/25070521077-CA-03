import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'white';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Enhanced base styles: 
  // - rounded-xl for a modern feel
  // - active:scale-95 for click feedback
  // - transform and transition for smooth animation
  // UPDATED: font-bold -> font-semibold to match typography system
  const baseStyles = "relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-xl overflow-hidden group active:scale-95 transform will-change-transform";
  
  // Slightly larger padding for better visual presence
  const sizeStyles = "px-6 py-3 text-sm md:text-base";

  const variants = {
    // Primary: Custom Gradient from reference (0% #C266E5, 75% #A74CE9, 100% #8C32EC)
    primary: "bg-[linear-gradient(90deg,#C266E5_0%,#A74CE9_75%,#8C32EC_100%)] text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 border border-transparent",
    
    // Outline: Border interaction filling on hover
    outline: "bg-transparent border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:border-purple-500 hover:-translate-y-1 shadow-sm hover:shadow-lg",
    
    // Ghost: Subtle lift
    ghost: "bg-transparent text-brand-gray dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:-translate-y-0.5",
    
    // White: Crisp, high-contrast, 'pop' effect for CTAs on colored backgrounds
    white: "bg-white text-purple-700 border border-transparent hover:border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)] hover:-translate-y-1"
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button 
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      <span className="relative flex items-center gap-2 z-10">
        {children}
      </span>
    </button>
  );
};