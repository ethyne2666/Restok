import { Camera, Keyboard, Mic, PenLine } from 'lucide-react';

const icons = { VOICE: Mic, IMAGE: Camera, TEXT: Keyboard, MANUAL: PenLine };

export function SourceIcon({ source, size = 14 }) {
  const Icon = icons[source] ?? PenLine;
  return <Icon size={size} />;
}