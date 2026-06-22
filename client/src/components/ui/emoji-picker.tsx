import {
  Smile,
  Users,
  PawPrint,
  Utensils,
  MapPin,
  PartyPopper,
  Lightbulb,
  Flag,
  Search,
  Clock,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
  maxRecentEmojis?: number;
}

const categoryIcons = {
  "Smileys & Emotion": Smile,
  "People & Body": Users,
  "Animals & Nature": PawPrint,
  "Food & Drink": Utensils,
  "Travel & Places": MapPin,
  Activities: PartyPopper,
  Objects: Lightbulb,
  Symbols: Flag,
  Flags: Flag,
};

interface EmojiGridProps {
  emojis: typeof emojis;
  showCategory?: boolean;
  selectedIndex: number;
  allVisibleEmojis: typeof emojis;
  onEmojiClick: (emoji: string) => void;
  setSelectedIndex: (index: number) => void;
  emojiGridRef: React.RefObject<HTMLDivElement | null>;
}

const EmojiGrid = ({
  emojis: emojiList,
  showCategory = false,
  selectedIndex,
  allVisibleEmojis,
  onEmojiClick,
  setSelectedIndex,
  emojiGridRef,
}: EmojiGridProps) => (
  <div className="grid grid-cols-8 gap-1 p-2" ref={emojiGridRef}>
    {emojiList.map((emoji, index) => {
      const globalIndex = showCategory
        ? allVisibleEmojis.findIndex((e) => e.emoji === emoji.emoji)
        : index;

      return (
        <Button
          key={`${emoji.emoji}-${index}`}
          variant="ghost"
          size="sm"
          className={`h-10 w-10 p-0 transition-colors hover:bg-accent ${
            selectedIndex === globalIndex ? "bg-accent ring-2 ring-primary" : ""
          }`}
          onClick={() => onEmojiClick(emoji.emoji)}
          title={emoji.name}
          onMouseEnter={() => setSelectedIndex(globalIndex)}
        >
          <span className="text-lg" role="img" aria-label={emoji.name}>
            {emoji.emoji}
          </span>
        </Button>
      );
    })}
  </div>
);

export default function EmojiPicker({
  onEmojiSelect,
  trigger,
  maxRecentEmojis = 24,
}: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recent-emojis");
    if (stored) {
      try {
        startTransition(() => {
          setRecentEmojis(JSON.parse(stored));
        });
      } catch {
        /* empty */
      }
    }
  }, []);
  const categories = useMemo(() => {
    const categoryOrder = [
      "Smileys & Emotion",
      "People & Body",
      "Animals & Nature",
      "Food & Drink",
      "Travel & Places",
      "Activities",
      "Objects",
      "Symbols",
      "Flags",
    ];

    const availableCategories = Array.from(
      new Set(emojis.map((emoji) => emoji.category)),
    );
    return categoryOrder.filter((cat) => availableCategories.includes(cat));
  }, []);

  const filteredEmojis = useMemo(() => {
    if (!searchTerm) return emojis;

    const searchLower = searchTerm.toLowerCase();
    return emojis.filter((emoji) => {
      const nameMatch = emoji.name.toLowerCase().includes(searchLower);
      const categoryMatch = emoji.category.toLowerCase().includes(searchLower);

      const emojiKeywords =
        "keywords" in emoji && Array.isArray(emoji.keywords)
          ? emoji.keywords
          : [];
      const keywordMatch = emojiKeywords.some((keyword: string) =>
        keyword.toLowerCase().includes(searchLower),
      );

      return nameMatch || categoryMatch || keywordMatch;
    });
  }, [searchTerm]);

  const emojisByCategory = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category] = filteredEmojis.filter(
          (emoji) => emoji.category === category,
        );
        return acc;
      },
      {} as Record<string, typeof emojis>,
    );
  }, [categories, filteredEmojis]);

  const allVisibleEmojis = useMemo(() => {
    if (searchTerm) {
      return filteredEmojis;
    }
    return categories.flatMap((category) => emojisByCategory[category] || []);
  }, [searchTerm, filteredEmojis, categories, emojisByCategory]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);

    const newRecent = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      maxRecentEmojis,
    );

    setRecentEmojis(newRecent);
    localStorage.setItem("recent-emojis", JSON.stringify(newRecent));

    setIsOpen(false);
    setSearchTerm("");
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allVisibleEmojis.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allVisibleEmojis[selectedIndex]) {
          handleEmojiClick(allVisibleEmojis[selectedIndex].emoji);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    startTransition(() => {
      setSelectedIndex(-1);
    });
  }, [searchTerm]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 bg-transparent p-0"
          >
            <Smile className="h-4 w-4" />
            <span className="sr-only">Open emoji picker</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="end"
        onKeyDown={handleKeyDown}
      >
        <div className="space-y-2 border-b p-3">
          <div className="relative">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search emojis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              aria-label="Search emojis"
            />
          </div>

          {searchTerm && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{filteredEmojis.length} results found</span>
              {filteredEmojis.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Use ↑↓ to navigate, Enter to select
                </Badge>
              )}
            </div>
          )}
        </div>

        {searchTerm ? (
          <ScrollArea className="h-64">
            {filteredEmojis.length > 0 ? (
              <EmojiGrid
                emojis={filteredEmojis}
                showCategory
                selectedIndex={selectedIndex}
                allVisibleEmojis={allVisibleEmojis}
                onEmojiClick={handleEmojiClick}
                setSelectedIndex={setSelectedIndex}
                emojiGridRef={emojiGridRef}
              />
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                <Search className="mb-2 h-8 w-8" />
                <p className="text-sm">No emojis found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            )}
          </ScrollArea>
        ) : (
          <Tabs
            defaultValue={recentEmojis.length > 0 ? "recent" : categories[0]}
            className="w-full"
          >
            <TabsList
              className="grid h-auto w-full p-1"
              style={{
                gridTemplateColumns: `repeat(${recentEmojis.length > 0 ? Math.min(categories.length + 1, 4) : Math.min(categories.length, 4)}, 1fr)`,
              }}
            >
              {recentEmojis.length > 0 && (
                <TabsTrigger
                  value="recent"
                  className="flex items-center gap-1 px-2 py-1 text-xs"
                  title="Recently used"
                >
                  <Clock className="h-3 w-3" />
                  <span className="hidden sm:inline">Recent</span>
                </TabsTrigger>
              )}
              {categories
                .slice(0, recentEmojis.length > 0 ? 3 : 4)
                .map((category) => {
                  const IconComponent =
                    categoryIcons[category as keyof typeof categoryIcons] ||
                    Smile;
                  return (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                      title={category}
                    >
                      <IconComponent className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {category.split(" ")[0]}
                      </span>
                    </TabsTrigger>
                  );
                })}
            </TabsList>

            {recentEmojis.length > 0 && (
              <TabsContent value="recent" className="mt-0">
                <ScrollArea className="h-64">
                  <div className="p-2">
                    <div className="mb-2 flex items-center gap-2 px-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recently Used</span>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {recentEmojis.map((emoji, index) => (
                        <Button
                          key={`recent-${emoji}-${index}`}
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 transition-colors hover:bg-accent"
                          onClick={() => handleEmojiClick(emoji)}
                          title={`Recently used: ${emoji}`}
                        >
                          <span className="text-lg" role="img">
                            {emoji}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <ScrollArea className="h-64">
                  {emojisByCategory[category]?.length > 0 ? (
                    <div className="p-2">
                      <div className="mb-2 flex items-center gap-2 px-1">
                        {(() => {
                          const IconComponent =
                            categoryIcons[
                              category as keyof typeof categoryIcons
                            ] || Smile;
                          return (
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          );
                        })()}
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {emojisByCategory[category].length}
                        </Badge>
                      </div>
                      <EmojiGrid
                        emojis={emojisByCategory[category]}
                        selectedIndex={selectedIndex}
                        allVisibleEmojis={allVisibleEmojis}
                        onEmojiClick={handleEmojiClick}
                        setSelectedIndex={setSelectedIndex}
                        emojiGridRef={emojiGridRef}
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center text-muted-foreground">
                      <p className="text-sm">No emojis in this category</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  );
}

const emojis = [
  {
    code: ["1F600"],
    emoji: "😀",
    name: "grinning face",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F603"],
    emoji: "😃",
    name: "grinning face with big eyes",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F604"],
    emoji: "😄",
    name: "grinning face with smiling eyes",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F601"],
    emoji: "😁",
    name: "beaming face with smiling eyes",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F606"],
    emoji: "😆",
    name: "grinning squinting face",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F605"],
    emoji: "😅",
    name: "grinning face with sweat",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F602"],
    emoji: "😂",
    name: "face with tears of joy",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F923"],
    emoji: "🤣",
    name: "rolling on the floor laughing",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F642"],
    emoji: "🙂",
    name: "slightly smiling face",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F609"],
    emoji: "😉",
    name: "winking face",
    category: "Smileys & Emotion",
    subcategory: "face-smiling",
  },
  {
    code: ["1F60D"],
    emoji: "😍",
    name: "smiling face with heart-eyes",
    category: "Smileys & Emotion",
    subcategory: "face-affection",
  },
  {
    code: ["1F970"],
    emoji: "🥰",
    name: "smiling face with hearts",
    category: "Smileys & Emotion",
    subcategory: "face-affection",
  },
  {
    code: ["1F618"],
    emoji: "😘",
    name: "face blowing a kiss",
    category: "Smileys & Emotion",
    subcategory: "face-affection",
  },
  {
    code: ["1F60E"],
    emoji: "😎",
    name: "smiling face with sunglasses",
    category: "Smileys & Emotion",
    subcategory: "face-glasses",
  },
  {
    code: ["1F913"],
    emoji: "🤓",
    name: "nerd face",
    category: "Smileys & Emotion",
    subcategory: "face-glasses",
  },
  {
    code: ["1F914"],
    emoji: "🤔",
    name: "thinking face",
    category: "Smileys & Emotion",
    subcategory: "face-hand",
  },
  {
    code: ["1F92D"],
    emoji: "🤭",
    name: "face with hand over mouth",
    category: "Smileys & Emotion",
    subcategory: "face-hand",
  },
  {
    code: ["1FAE1"],
    emoji: "🫡",
    name: "saluting face",
    category: "Smileys & Emotion",
    subcategory: "face-hand",
  },
  {
    code: ["1F644"],
    emoji: "🙄",
    name: "face with rolling eyes",
    category: "Smileys & Emotion",
    subcategory: "face-neutral-skeptical",
  },
  {
    code: ["1F610"],
    emoji: "😐",
    name: "neutral face",
    category: "Smileys & Emotion",
    subcategory: "face-neutral-skeptical",
  },
  {
    code: ["1F612"],
    emoji: "😒",
    name: "unamused face",
    category: "Smileys & Emotion",
    subcategory: "face-neutral-skeptical",
  },
  {
    code: ["1F62D"],
    emoji: "😭",
    name: "loudly crying face",
    category: "Smileys & Emotion",
    subcategory: "face-concerned",
  },
  {
    code: ["1F622"],
    emoji: "😢",
    name: "crying face",
    category: "Smileys & Emotion",
    subcategory: "face-concerned",
  },
  {
    code: ["1F97A"],
    emoji: "🥺",
    name: "pleading face",
    category: "Smileys & Emotion",
    subcategory: "face-concerned",
  },
  {
    code: ["1F631"],
    emoji: "😱",
    name: "face screaming in fear",
    category: "Smileys & Emotion",
    subcategory: "face-concerned",
  },
  {
    code: ["1F620"],
    emoji: "😠",
    name: "angry face",
    category: "Smileys & Emotion",
    subcategory: "face-negative",
  },
  {
    code: ["1F621"],
    emoji: "😡",
    name: "pouting face",
    category: "Smileys & Emotion",
    subcategory: "face-negative",
  },
  {
    code: ["1F92C"],
    emoji: "🤬",
    name: "face with symbols on mouth",
    category: "Smileys & Emotion",
    subcategory: "face-negative",
  },
  {
    code: ["2764"],
    emoji: "❤️",
    name: "red heart",
    category: "Smileys & Emotion",
    subcategory: "emotion",
  },
  {
    code: ["1F49B"],
    emoji: "💛",
    name: "yellow heart",
    category: "Smileys & Emotion",
    subcategory: "emotion",
  },
  {
    code: ["1F49A"],
    emoji: "💚",
    name: "green heart",
    category: "Smileys & Emotion",
    subcategory: "emotion",
  },
  {
    code: ["1F499"],
    emoji: "💙",
    name: "blue heart",
    category: "Smileys & Emotion",
    subcategory: "emotion",
  },
  {
    code: ["1F49C"],
    emoji: "💜",
    name: "purple heart",
    category: "Smileys & Emotion",
    subcategory: "emotion",
  },
  {
    code: ["1F494"],
    emoji: "💔",
    name: "broken heart",
    category: "Smileys & Emotion",
    subcategory: "emotion",
  },
  {
    code: ["1F525"],
    emoji: "🔥",
    name: "fire",
    category: "Travel & Places",
    subcategory: "sky & weather",
  },
  {
    code: ["2728"],
    emoji: "✨",
    name: "sparkles",
    category: "Activities",
    subcategory: "event",
  },
  {
    code: ["1F389"],
    emoji: "🎉",
    name: "party popper",
    category: "Activities",
    subcategory: "event",
  },
  {
    code: ["1F680"],
    emoji: "🚀",
    name: "rocket",
    category: "Travel & Places",
    subcategory: "transport-air",
  },
  {
    code: ["1F44D"],
    emoji: "👍",
    name: "thumbs up",
    category: "People & Body",
    subcategory: "hand-fingers-closed",
  },
  {
    code: ["1F44E"],
    emoji: "👎",
    name: "thumbs down",
    category: "People & Body",
    subcategory: "hand-fingers-closed",
  },
  {
    code: ["1F44F"],
    emoji: "👏",
    name: "clapping hands",
    category: "People & Body",
    subcategory: "hands",
  },
  {
    code: ["1F64C"],
    emoji: "🙌",
    name: "raising hands",
    category: "People & Body",
    subcategory: "hands",
  },
  {
    code: ["1F64F"],
    emoji: "🙏",
    name: "folded hands",
    category: "People & Body",
    subcategory: "hands",
  },
  {
    code: ["1F47B"],
    emoji: "👻",
    name: "ghost",
    category: "Smileys & Emotion",
    subcategory: "costume-face",
  },
  {
    code: ["1F480"],
    emoji: "💀",
    name: "skull",
    category: "Smileys & Emotion",
    subcategory: "face-costume",
  },
  {
    code: ["1F916"],
    emoji: "🤖",
    name: "robot",
    category: "Smileys & Emotion",
    subcategory: "face-costume",
  },
];
