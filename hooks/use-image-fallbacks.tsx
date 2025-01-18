import { useState } from "react";

type ImageFallbacksHook = {
  getSrc: (key: number, initialSrc: string) => string;
  handleError: (key: number) => void;
};

export const useImageFallbacks = () : ImageFallbacksHook => {
  const [srcs, setSrcs] = useState<Record<string, string>>({});

  const handleError = (key: number): void => {
    setSrcs((prev) => ({
      ...prev,
      [key]: '/img/default.jpg',
    }));
  };

  const getSrc = (key: number, initialSrc: string): string => {
    return srcs[key] || initialSrc;
  };

  return { getSrc, handleError };
};