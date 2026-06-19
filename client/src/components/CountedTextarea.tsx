import * as React from "react";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";

export interface CountedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
}

const CountedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CountedTextareaProps
>(
  (
    { className = "", maxLength, value, defaultValue, onChange, ...props },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      value !== undefined ? value : defaultValue || "",
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }

      if (onChange) {
        onChange(e);
      }
    };

    const currentLength = String(internalValue).length;
    const isAtLimit = currentLength >= maxLength;

    return (
      <div className="relative flex-1 flex flex-col w-full min-w-0">
        <Textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`pb-8 ${className}`}
          {...props}
        />
        <span
          className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${
            isAtLimit ? "text-destructive" : "text-muted-foreground/60"
          }`}
        >
          {currentLength} / {maxLength}
        </span>
      </div>
    );
  },
);

CountedTextarea.displayName = "CountedTextarea";

export { CountedTextarea };
