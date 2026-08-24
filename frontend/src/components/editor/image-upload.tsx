"use client";

import React, { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { api } from "@/lib/axios";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Logo",
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = "";

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP)");
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      if (response.data?.success && response.data?.data?.url) {
        onChange(response.data.data.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(response.data?.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative group w-32 h-32 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex items-center justify-center">
          <Image
            src={value}
            alt="Uploaded Preview"
            fill
            className="object-contain p-2"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              onClick={() => {
                onChange("");
                onRemove?.();
              }}
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-center px-2">
              <Upload className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
