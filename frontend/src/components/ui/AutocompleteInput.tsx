"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Loader2, X } from "lucide-react";
import api from "@/lib/axios";

interface Suggestion {
  id: number;
  label: string;
  sublabel?: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  endpoint: string;
  buildLabel: (item: any) => string;
  buildSublabel?: (item: any) => string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  minChars?: number;
  multiple?: boolean;
}

export default function AutocompleteInput({
  value,
  onChange,
  endpoint,
  buildLabel,
  buildSublabel,
  placeholder = "Search...",
  icon,
  className = "",
  minChars = 2,
  multiple = true,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getCurrentTerm = (val: string) => {
    if (!multiple) return val.trim();
    const lastComma = val.lastIndexOf(",");
    return lastComma >= 0 ? val.slice(lastComma + 1).trim() : val.trim();
  };

  const confirmedTerms = useMemo(() => {
    if (!multiple) return [] as string[];
    const lastComma = value.lastIndexOf(",");
    const head = lastComma >= 0 ? value.slice(0, lastComma) : "";
    return head
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }, [value, multiple]);

  const visibleSuggestions = useMemo(
    () =>
      suggestions.filter(
        (s) => !confirmedTerms.includes(s.label.toLowerCase()),
      ),
    [suggestions, confirmedTerms],
  );

  const fetchSuggestions = useCallback(
    async (q: string) => {
      if (q.length < minChars) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`${endpoint}?q=${encodeURIComponent(q)}`);
        const items: any[] = res.data?.data ?? [];
        setSuggestions(
          items.map((item) => ({
            id: item.id,
            label: buildLabel(item),
            sublabel: buildSublabel ? buildSublabel(item) : undefined,
          })),
        );
        setOpen(true);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, buildLabel, buildSublabel, minChars],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    onChange(q);
    const term = getCurrentTerm(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(term), 300);
  };

  const handleSelect = (s: Suggestion) => {
    if (!multiple) {
      onChange(s.label);
      setOpen(false);
      setSuggestions([]);
      inputRef.current?.blur();
      return;
    }

    const lastComma = value.lastIndexOf(",");
    const base = lastComma >= 0 ? value.slice(0, lastComma + 1).trimEnd() : "";

    if (confirmedTerms.includes(s.label.toLowerCase())) {
      onChange(base ? `${base} ` : "");
    } else {
      onChange(base ? `${base} ${s.label}, ` : `${s.label}, `);
    }
    setOpen(false);
    setSuggestions([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && visibleSuggestions.length > 0) setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, visibleSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (open && visibleSuggestions.length > 0) {
        e.preventDefault();
        handleSelect(visibleSuggestions[activeIdx >= 0 ? activeIdx : 0]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const clear = () => {
    onChange("");
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      <div className="flex items-center gap-2.5 px-3 py-1.5">
        {icon && <span className="shrink-0">{icon}</span>}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => visibleSuggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm font-medium"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="size-3.5 text-primary animate-spin shrink-0" />
        )}
        {value && !loading && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && visibleSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <ul className="max-h-52 overflow-y-auto py-1">
            {visibleSuggestions.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(s);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    i === (activeIdx >= 0 ? activeIdx : 0)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{s.label}</span>
                  {s.sublabel && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {s.sublabel}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
            Press <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">Enter</kbd> to select &ldquo;{visibleSuggestions[activeIdx >= 0 ? activeIdx : 0].label}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}
