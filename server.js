const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 2);

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    },
    handler: (req, res) => {
        res.status(429).json({
            status: false,
            message: "Sabar dulu Kak, IP Anda diblokir 1 menit karena aktivitas spam"
        });
    }
});


app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/changelog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'changelog.html'));
});

const apiGuard = (req, res, next) => {
    try {

        const endpointsPath = path.resolve(__dirname, 'endpoints.json');
        const settingsPath = path.resolve(__dirname, 'settings.json');

        const endpoints = JSON.parse(fs.readFileSync(endpointsPath, 'utf-8'));
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

        let allEndpoints = [];
        Object.values(endpoints).forEach(cat => allEndpoints.push(...cat));

        const target = allEndpoints.find(ep => req.path.startsWith(ep.path.split('?')[0]));

        if (target) {
            if (target.status !== 'online') {
                return res.status(503).json({ 
                    status: false, 
                    message: `Endpoint sedang ${target.status}.` 
                });
            }

            if (target.auth) {
                const userKey = req.query.apikey || (req.body && req.body.apikey);
                if (!userKey || !settings.api_keys.includes(userKey)) {
                    return res.status(403).json({ 
                        status: false, 
                        message: "API Key diperlukan atau tidak valid." 
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
        const endpoints = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'endpoints.json'), 'utf-8'));
        const settingsFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings.json'), 'utf-8'));
        const { api_keys, ...safeSettings } = settingsFile;
        res.json({ 
            settings: safeSettings, 
            endpoints 
        });
    } catch (err) {
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

                const route = require(fullPath);
                if (typeof route === 'function') {
                    route(app);
                    console.log(`✅ Loaded: ${file}`);
                }
            } catch (e) {
                console.log(`❌ Error ${file}: ${e.message}`);
            }
        }
    });
};
loadRoutes(apiDir);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
