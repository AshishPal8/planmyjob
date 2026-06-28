"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, X } from "lucide-react";
import api from "@/lib/axios";

interface Suggestion {
  id: number;
  label: string;      // display text
  sublabel?: string;  // e.g. state name for cities
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  endpoint: string;         // e.g. "/search/skills" or "/search/cities"
  buildLabel: (item: any) => string;       // extract main label from API item
  buildSublabel?: (item: any) => string;   // extract sublabel (optional)
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  minChars?: number;
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
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < minChars) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await api.get(`${endpoint}?q=${encodeURIComponent(q)}`);
      const items: any[] = res.data?.data ?? [];
      setSuggestions(
        items.map((item) => ({
          id: item.id,
          label: buildLabel(item),
          sublabel: buildSublabel ? buildSublabel(item) : undefined,
        }))
      );
      setOpen(true);
      setActiveIdx(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, buildLabel, buildSublabel, minChars]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    onChange(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 300);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.label);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const clear = () => { onChange(""); setSuggestions([]); setOpen(false); };

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      <div className="flex items-center gap-2.5 px-3 py-1">
        {icon && <span className="shrink-0">{icon}</span>}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="bg-transparent w-full text-[#0c1a3a] placeholder-[#a8bcd8] outline-none text-sm"
          autoComplete="off"
        />
        {loading && <Loader2 size={13} className="text-primary animate-spin shrink-0" />}
        {value && !loading && (
          <button type="button" onClick={clear} className="shrink-0 text-[#a8bcd8] hover:text-[#7a92c1]">
            <X size={13} />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e2eaf8] rounded-2xl shadow-xl z-50 overflow-hidden">
          <ul className="max-h-52 overflow-y-auto py-1">
            {suggestions.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors ${
                    i === activeIdx ? "bg-primary/10 text-primary" : "text-[#2d4070] hover:bg-[#f8fbff]"
                  }`}
                >
                  <span className="font-medium">{s.label}</span>
                  {s.sublabel && (
                    <span className="text-xs text-[#7a92c1] shrink-0">{s.sublabel}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {/* free-text hint for city */}
          <div className="px-4 py-2 border-t border-[#f0f5ff] text-xs text-[#7a92c1]">
            Press <kbd className="bg-[#f0f5ff] px-1.5 py-0.5 rounded font-mono">Enter</kbd> to search with "{value}"
          </div>
        </div>
      )}
    </div>
  );
}
