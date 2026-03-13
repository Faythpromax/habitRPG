import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<any>(null)

export function ThemeProvider({children} : {children:React.ReactNode}) {
    const[theme, setTheme] = useState("light");

    function toggleTheme() {
        setTheme(prev => prev === "light" ? "dark" : "light");
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext)
}