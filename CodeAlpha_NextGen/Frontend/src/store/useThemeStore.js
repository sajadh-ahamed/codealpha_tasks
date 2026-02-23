import { create } from 'zustand';

const getStoredTheme = () => {
    if (typeof window === 'undefined') return 'light';

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
};

const initialTheme = getStoredTheme();
applyTheme(initialTheme);

const useThemeStore = create((set, get) => ({
    theme: initialTheme,

    setTheme: (theme) => {
        applyTheme(theme);
        localStorage.setItem('theme', theme);
        set({ theme });
    },

    toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
    }
}));

export default useThemeStore;
