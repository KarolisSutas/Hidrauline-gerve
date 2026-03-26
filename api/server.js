// ============================================
// Kontaktų formos backend API
// Honeypot + reCAPTCHA v3 + Rate limiting + Nodemailer
// ============================================

import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(express.json());

// --- Rate limiter (paprastas, be papildomų paketų) ---
const rateLimit = new Map();
const RATE_WINDOW = 60 * 1000; // 1 minutė
const RATE_MAX = 3;            // max 3 užklausos per minutę iš vieno IP

function rateLimiter(req, res, next) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const now = Date.now();

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, []);
    }

    const timestamps = rateLimit.get(ip).filter(t => now - t < RATE_WINDOW);
    timestamps.push(now);
    rateLimit.set(ip, timestamps);

    if (timestamps.length > RATE_MAX) {
        return res.status(429).json({
            success: false,
            message: 'Per daug užklausų. Pabandykite vėliau.'
        });
    }

    next();
}

// Valyti rate limit kas 5 min
setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimit) {
        const valid = timestamps.filter(t => now - t < RATE_WINDOW);
        if (valid.length === 0) rateLimit.delete(ip);
        else rateLimit.set(ip, valid);
    }
}, 5 * 60 * 1000);

// --- Nodemailer transportas ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true jei 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Patikrinti SMTP prisijungimą paleidžiant
transporter.verify()
    .then(() => console.log('✅ SMTP prisijungimas sėkmingas'))
    .catch(err => console.error('❌ SMTP klaida:', err.message));

// --- reCAPTCHA v3 tikrinimas ---
async function verifyRecaptcha(token) {
    if (!process.env.RECAPTCHA_SECRET) {
        console.error('❌ RECAPTCHA_SECRET nenustatytas — užklausa blokuojama');
        return false;
    }

    if (!token) {
        console.warn('⚠️  reCAPTCHA token tuščias — užklausa blokuojama');
        return false;
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET,
                response: token,
            }),
        });

        if (!response.ok) {
            console.error('❌ reCAPTCHA API atsakė:', response.status);
            return false;
        }

        const data = await response.json();

        if (data.score < 0.7) {
            console.warn('⚠️  Žemas reCAPTCHA score:', data.score, '| action:', data.action);
        }

        return data.success && data.score >= 0.5 && data.action === 'contact';
    } catch (err) {
        console.error('❌ reCAPTCHA klaida:', err.message);
        return false;
    }
}

// --- Validacija ---
function validateFields({ vardas, telefonas, email, tema, zinute }) {
    const errors = [];

    if (!vardas || vardas.trim().length < 2)
        errors.push('Vardas privalomas (min. 2 simboliai)');

    if (telefonas && telefonas.trim() && !/^[0-9\s]{7,11}$/.test(telefonas.trim()))
        errors.push('Neteisingas telefono formatas');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        errors.push('Neteisingas el. pašto formatas');

    if (!tema || tema.trim().length < 2)
        errors.push('Tema privaloma');

    if (!zinute || zinute.trim().length < 10)
        errors.push('Žinutė per trumpa (min. 10 simbolių)');

    return errors;
}

// ============================================
// POST /api/contact
// ============================================
app.post('/api/contact', rateLimiter, async (req, res) => {
    try {
        const { vardas, telefonas, email, tema, zinute, website, recaptchaToken } = req.body;

        // 1. Honeypot patikrinimas
        if (website) {
            // Atsakome "sėkmingai" kad botas nesuprastų
            console.log('🍯 Honeypot sugavo botą');
            return res.json({ success: true });
        }

        // 2. reCAPTCHA patikrinimas
        if (!recaptchaToken) {
            return res.status(400).json({
                success: false,
                code: 'recaptcha_missing',
                message: 'Apsaugos patikra neužsikrovė. Išjunkite skelbimų blokavimo plėtinį (ad-blocker) arba pabandykite kita naršyklę.'
            });
        }
        
        const captchaOk = await verifyRecaptcha(recaptchaToken);
        if (!captchaOk) {
            return res.status(400).json({
                success: false,
                code: 'recaptcha_failed',
                message: 'Nepavyko patvirtinti, kad nesate robotas. Pabandykite dar kartą.'
            });
        }

        // 3. Laukų validacija
        const errors = validateFields({ vardas, telefonas, email, tema, zinute });
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        // 4. Siųsti email
        const tel = telefonas?.trim() ? `+370 ${escapeHtml(telefonas.trim())}` : 'Nenurodytas';

        await transporter.sendMail({
            from: `"Svetainės užklausa" <${process.env.SMTP_USER}>`,
            to: process.env.RECIPIENT_EMAIL,
            subject: `Užklausa: ${tema.trim()}`,
            text: [
                'Nauja užklausa iš svetainės',
                '',
                `Vardas: ${vardas.trim()}`,
                `Telefonas: ${tel}`,
                `El. paštas: ${email.trim()}`,
                `Tema: ${tema.trim()}`,
                `Žinutė: ${zinute.trim()}`,
                '',
                '---',
                'Šis laiškas sugeneruotas automatiškai iš www.hidraulinesgerves.lt kontaktų formos.',
            ].join('\n'),
            html: `<!DOCTYPE html>
            <html lang="lt">
            <head><meta charset="UTF-8"></head>
            <body style="margin:0; padding:16px; font-family:Arial,sans-serif; font-size:14px; color:#333;">
                <h2 style="color:#991b1b; margin-top:0;">Nauja užklausa iš svetainės</h2>
                <table style="border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 16px 8px 0; font-weight:bold; color:#555;">Vardas:</td>
                        <td style="padding:8px 0;">${escapeHtml(vardas.trim())}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 16px 8px 0; font-weight:bold; color:#555;">Telefonas:</td>
                        <td style="padding:8px 0;">${tel}</td>
                    /tr>
                    <tr>
                        <td style="padding:8px 16px 8px 0; font-weight:bold; color:#555;">El. paštas:</td>
                        <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></td>
                    </tr>
                    <tr>
                        <td style="padding:8px 16px 8px 0; font-weight:bold; color:#555;">Tema:</td>
                        <td style="padding:8px 0;">${escapeHtml(tema.trim())}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 16px 8px 0; font-weight:bold; color:#555; vertical-align:top;">Žinutė:</td>
                        <td style="padding:8px 0; white-space:pre-wrap;">${escapeHtml(zinute.trim())}</td>
                    </tr>
                </table>
                <hr style="margin-top:24px; border:none; border-top:1px solid #ddd;">
                <p style="font-size:12px; color:#999;">
                Šis laiškas sugeneruotas automatiškai iš www.hidraulinesgerves.lt kontaktų formos.
                </p>
            </body>
            </html>`,
        });

        console.log(`✅ Email išsiųstas: ${tema} (nuo ${email})`);
        res.json({ success: true });

    } catch (err) {
        console.error('❌ Serverio klaida:', err);
        res.status(500).json({
            success: false,
            message: 'Serverio klaida. Pabandykite vėliau arba susisiekite telefonu.'
        });
    }
});

// --- XSS apsauga ---
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- Health check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Start ---
app.listen(PORT, () => {
    console.log(`🚀 API serveris veikia: http://localhost:${PORT}`);
});
