import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  return (
    <Button 
      variant="outline-light" 
      size="sm" 
      onClick={toggleTheme}
      className="ms-2"
    >
      {darkMode ? '☀️' : '🌙'}
    </Button>
  );
}