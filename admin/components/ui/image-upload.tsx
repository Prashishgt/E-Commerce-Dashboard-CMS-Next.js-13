"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export default function ImageUpload({ disabled, onChange, onRemove, value }: ImageUploadProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const add = () => {
    try {
      const parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
      onChange(parsed.toString());
      setUrl("");
      setError("");
    } catch {
      setError("Enter a valid image URL starting with https:// or http://.");
    }
  };
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-3">
      {value.map((image) => <div key={image} className="relative h-28 w-28 overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="Catalog preview" className="h-full w-full object-cover" />
        <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-7 w-7" disabled={disabled} onClick={() => onRemove(image)} aria-label="Remove image"><Trash className="h-3 w-3" /></Button>
      </div>)}
    </div>
    <div className="flex max-w-xl gap-2"><Input value={url} disabled={disabled} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/image.jpg" aria-label="Image URL" /><Button type="button" variant="secondary" disabled={disabled || !url} onClick={add}>Add image URL</Button></div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <p className="text-xs text-muted-foreground">Paste a public image URL. No cloud account needed.</p>
  </div>;
}
