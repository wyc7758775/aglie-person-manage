interface IconProps {
  className?: string;
  color?: string;
}

export const TaskIcon: React.FC<IconProps> = ({ 
  className = "w-5 h-5", 
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
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
