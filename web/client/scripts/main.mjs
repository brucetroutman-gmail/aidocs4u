// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    darkModeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
darkModeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Language selector
const languageSelect = document.getElementById('languageSelect');
languageSelect.addEventListener('change', (e) => {
    localStorage.setItem('language', e.target.value);
    // Language switching logic would go here
});

// Load saved language
const savedLanguage = localStorage.getItem('language') || 'en';
languageSelect.value = savedLanguage;
