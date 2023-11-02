import { create } from "zustand";

// language-context.ts for language indonesian and english
interface LanguageStore {
  language: "en" | "id";
  setLanguageId: () => void;
  setLanguageEn: () => void;
}

export const useLanguageContext = create<LanguageStore>()((set) => ({
  language:
    (typeof localStorage !== "undefined" &&
      (localStorage.getItem("language") as "en" | "id")) ||
    "en",
  setLanguageId: () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", "id");
    }
    return set({ language: "id" });
  },
  setLanguageEn: () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", "en");
    }
    return set({ language: "en" });
  },
}));
