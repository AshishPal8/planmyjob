"use client";
import { ExternalLink } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthAction } from "@/hooks/use-auth-action";

export default function ApplyButton({
  applyUrl,
  label,
  size,
  className,
}: {
  applyUrl: string;
  label: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}) {
  const { execute } = useAuthAction();

  return (
    <Button
      size={size}
      className={className}
      onClick={() =>
        execute(() => window.open(applyUrl, "_blank", "noopener,noreferrer"))
      }
    >
      {label} <ExternalLink size={13} />
    </Button>
  );
}
