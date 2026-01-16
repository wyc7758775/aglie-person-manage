interface IconProps {
  className?: string;
  color?: string;
}

export const StarIcon: React.FC<IconProps> = ({ 
  className = "w-4 h-4", 
  color = "currentColor" 
}) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill={color}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
