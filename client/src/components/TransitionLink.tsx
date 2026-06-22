import { Link, useNavigate, useLocation } from "react-router-dom";
import { animatePageOut } from "../utils/animations";

interface TransitionLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({
  to,
  children,
  className,
  onClick,
}: TransitionLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    const backgroundPath = location.state?.background?.pathname;
    const currentMainPath = backgroundPath || location.pathname;

    if (currentMainPath === to) {
      e.preventDefault();
      if (location.pathname !== to) {
        navigate(to);
      }
      return;
    }

    e.preventDefault();
    animatePageOut(to, navigate);
  };

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
