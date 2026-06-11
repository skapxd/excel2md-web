import { useState } from 'react';
import { copyTextToClipboard } from '@/lib/clipboard/copy-text-to-clipboard';

export type CopyFeedbackApi = {
  copiedKey: string;
  copy: (key: string, text: string) => Promise<void>;
};

export function useCopyFeedback(): CopyFeedbackApi {
  const [copiedKey, setCopiedKey] = useState('');

  const copy = async (key: string, text: string): Promise<void> => {
    const result = await copyTextToClipboard(text);
    if (!result.ok) return;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return { copiedKey, copy };
}
