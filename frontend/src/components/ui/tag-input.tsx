"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Type a skill and press Enter...",
  className,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const clean = tag.trim().replace(/^,+|,+$/g, "");
    if (!clean || value.map((t) => t.toLowerCase()).includes(clean.toLowerCase())) {
      setInput("");
      return;
    }
    onChange([...value, clean]);
    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  return (
    <div
      className={cn(
        "flex min-h-[44px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20 animate-in fade-in-50"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="rounded-full p-0.5 text-primary/70 hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          } else if (e.key === "Backspace" && input === "" && value.length > 0) {
            e.preventDefault();
            const lastTag = value[value.length - 1];
            if (lastTag) {
              removeTag(lastTag);
              setInput(lastTag);
            }
          }
        }}
        onBlur={() => {
          if (input.trim()) {
            addTag(input);
          }
        }}
        placeholder={value.length === 0 ? placeholder : "Add more..."}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm min-w-[120px]"
      />
    </div>
  );
}
