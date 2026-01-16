interface IconProps {
  className?: string;
  color?: string;
}

export const ChevronRightIcon: React.FC<IconProps> = ({ 
  className = "w-4 h-4", 
  color = "currentColor" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
