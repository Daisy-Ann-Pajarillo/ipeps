import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
    // Get theme from localStorage or default to system preference
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [darkMode, setDarkMode] = useState(storedTheme ? storedTheme === "dark" : systemPrefersDark);

    // Apply theme class to <html> for Tailwind dark mode compatibility
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // Toggle theme mode and update localStorage
    const toggleTheme = useCallback(() => {
        setDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    }, []);

    // Memoized MUI theme object
    const theme = useMemo(() =>
        createTheme({
            palette: { mode: darkMode ? "dark" : "light" },
        })
        , [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeMode = () => useContext(ThemeContext);
