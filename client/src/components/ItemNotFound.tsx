import TransitionLink from "./TransitionLink";
import { BirdSpinner } from "./ui/bird-spinner";

type ItemNotFoundProps = {
  title?: string;
  message?: string;
  errorCode?: string | number;
  isModal?: boolean;
  backLinkText?: string;
  backLinkTo?: string;
};

export default function ItemNotFound({
  title = "Not found",
  message = "The item you are looking for might have been deleted or moved to another nest.",
  errorCode = "404",
  isModal = false,
  backLinkText = "Back to Home",
  backLinkTo = "/",
}: ItemNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        {errorCode && (
          <h3 className="text-8xl font-black text-muted-foreground/5 absolute -top-8 left-1/2 -translate-x-1/2 select-none">
            {errorCode}
          </h3>
        )}
        <BirdSpinner size={64} label="" className="relative z-10" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground max-w-75 mx-auto">{message}</p>
      </div>

      {!isModal && (
        <TransitionLink to={backLinkTo}>{backLinkText}</TransitionLink>
      )}
    </div>
  );
}
