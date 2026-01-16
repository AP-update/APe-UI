const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('json spaces', 2);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const apiGuard = (req, res, next) => {
    try {
        const endpoints = JSON.parse(fs.readFileSync(path.join(__dirname, 'endpoints.json'), 'utf-8'));
        const settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf-8'));
        
        let allEndpoints = [];
        Object.values(endpoints).forEach(cat => allEndpoints.push(...cat));
        
        const target = allEndpoints.find(ep => req.path.startsWith(ep.path.split('?')[0]));

        if (target) {
            if (target.status !== 'online') {
                return res.status(503).json({ 
                    status: false, 
                    message: `Endpoint sedang ${target.status}. Silakan coba nanti.` 
                });
            }

            if (target.auth) {
                const userKey = req.query.apikey || (req.body && req.body.apikey);
                if (!userKey || !settings.api_keys.includes(userKey)) {
                    return res.status(403).json({ 
                        status: false, 
                        message: "API Key tidak valid atau diperlukan." 
                    });
                }
            }
        }
        next();
    } catch (error) {
        next();
    }
};

app.use(apiGuard);

app.get('/api/docs-data', (req, res) => {
    try {
        const endpoints = JSON.parse(fs.readFileSync(path.join(__dirname, 'endpoints.json'), 'utf-8'));
        const settingsFile = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf-8'));
        const { api_keys, ...safeSettings } = settingsFile;
        res.json({ 
            settings: safeSettings, 
            endpoints 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal memuat konfigurasi" });
    }
});


const apiDir = path.join(__dirname, 'api');
const loadRoutes = (dir) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            loadRoutes(fullPath);
        } else if (file.endsWith('.cjs') || file.endsWith('.js')) {
            try {
                require(fullPath)(app);
                console.log(`✅ Loaded: ${file}`);
            } catch (e) {
                console.log(`❌ Error ${file}: ${e.message}`);
            }
        }
    });
};
loadRoutes(apiDir);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
