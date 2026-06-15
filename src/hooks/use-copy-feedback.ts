import { useState } from 'react';
import { copyTextToClipboard } from '@/lib/clipboard/copy-text-to-clipboard';
import { reportDomainError } from '@/lib/errors/report-domain-error';

export type CopyFeedbackApi = {
  copiedKey: string;
  errorMessage: string;
  copy: (key: string, text: string) => Promise<void>;
};

type CopyFeedbackState = {
  copiedKey: string;
  errorMessage: string;
};

const COPY_ERROR_FEEDBACK_MS = 3000;
const COPY_SUCCESS_FEEDBACK_MS = 2000;

export function useCopyFeedback(): CopyFeedbackApi {
  const [feedback, setFeedback] = useState<CopyFeedbackState>({ copiedKey: '', errorMessage: '' });

  const copy = async (key: string, text: string): Promise<void> => {
    const result = await copyTextToClipboard(text);
    if (!result.ok) {
      reportDomainError('No se pudo copiar al portapapeles.', result.error);
      setFeedback({ copiedKey: '', errorMessage: result.error.message });
      setTimeout(() => setFeedback({ copiedKey: '', errorMessage: '' }), COPY_ERROR_FEEDBACK_MS);
      return;
    }
    setFeedback({ copiedKey: key, errorMessage: '' });
    setTimeout(() => setFeedback({ copiedKey: '', errorMessage: '' }), COPY_SUCCESS_FEEDBACK_MS);
  };

  return { copiedKey: feedback.copiedKey, copy, errorMessage: feedback.errorMessage };
}
