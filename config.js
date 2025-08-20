// Configuration file for RutinaApp
// Automatically detects environment and sets appropriate paths

const config = {
    // Detect environment
    isLocalhost: window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1',
    
    // Base paths
    basePath: window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1' ? './' : '/RutinaAppNew/',
    
    // Service Worker path
    swPath: window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ? './sw-dev.js' : '/RutinaAppNew/sw.js',
    
    // API endpoints (if you add them later)
    apiBase: window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://your-api.com',
    
    // App settings
    appName: 'RutinaApp',
    version: '1.0.0',
    
    // Storage keys
    storageKeys: {
        tasks: 'rutinaApp_tasks',
        events: 'rutinaApp_events',
        settings: 'rutinaApp_settings'
    },
    
    // Debug mode (automatically enabled in localhost)
    debug: window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1'
};

// Log configuration in debug mode
if (config.debug) {
    console.log('RutinaApp Configuration:', config);
}

// Function to toggle recurring options visibility
function toggleRecurringOptions() {
    const recurringSelect = document.getElementById('taskRecurring');
    const recurringOptions = document.getElementById('recurringOptions');
    
    if (recurringSelect && recurringOptions) {
        if (recurringSelect.value === 'yes') {
            recurringOptions.style.display = 'block';
        } else {
            recurringOptions.style.display = 'none';
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.RutinaAppConfig = config;
}
