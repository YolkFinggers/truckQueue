        const root = document.querySelector(':root');

        // Function to apply the font size from storage AT BOOTZ
        function applyFontSize() {
            const size = localStorage.getItem('globalFontSize') || "3";
            root.style.setProperty('--dynamic-fs', size + 'rem');
        }

        // Apply on initial load
        applyFontSize();

        // LIVE UPDATE: Listen for changes made in the other tab
        window.addEventListener('storage', (e) => {
            if (e.key === 'globalFontSize') {
                applyFontSize();
            }
        });