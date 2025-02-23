// filepath: /src/components/DarkModeToggle.tsx
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, []);

  const toggleDarkMode = () => {
    const darkMode = !isDarkMode;
    setIsDarkMode(darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
    document.body.classList.toggle("dark", darkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 bg-gray-200 dark:bg-gray-800 rounded">
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;