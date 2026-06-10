import { useNavigate } from "react-router-dom";
import { animatePageOut } from "../utils/animations";

interface TransitionLinkProps {
  to: string;
  label: string;
  className?: string;
}

export default function TransitionLink({
  to,
  label,
  className,
}: TransitionLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    animatePageOut(to, navigate);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {label}
    </a>
  );
}
