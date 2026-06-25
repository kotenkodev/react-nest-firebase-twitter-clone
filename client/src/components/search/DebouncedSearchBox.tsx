import { useEffect, useState } from "react";
import { useSearchBox, type UseSearchBoxProps } from "react-instantsearch";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

export const DebouncedSearchBox = (props: UseSearchBoxProps) => {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const debouncedInputValue = useDebounce(inputValue, 700);

  useEffect(() => {
    refine(debouncedInputValue);
  }, [debouncedInputValue, refine]);

  return (
    <div className="flex bg-muted px-4 py-2 border transition-all items-center focus-within:bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
      <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        placeholder="Search Birb..."
        autoFocus
        className="bg-transparent border-none grow outline-none text-foreground w-full"
      />
    </div>
  );
};
