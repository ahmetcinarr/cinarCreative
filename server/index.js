const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantısı
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'selvi_gsm',
    charset: 'utf8mb4'
};

let db;

// Veritabanı bağlantısını başlat
async function initDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('✅ MySQL veritabanına bağlandı');
    } catch (error) {
        console.error('❌ Veritabanı bağlantı hatası:', error);
        process.exit(1);
    }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (!req.user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Routes

// Kullanıcı kayıt
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Email kontrolü
        const [existingUser] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcıyı kaydet
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword]
        );

        // Token oluştur
        const token = jwt.sign(
            { 
                id: result.insertId, 
                email, 
                is_admin: false 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kayıt başarılı',
            token,
            user: {
                id: result.insertId,
                firstName,
                lastName,
                email,
                is_admin: false
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kullanıcı bilgilerini getir
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, first_name, last_name, email, is_admin, is_active, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const user = users[0];
        res.json({
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                is_admin: user.is_admin,
                is_active: user.is_active,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('User info error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kullanıcı giriş
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Geçersiz email veya şifre' });
        }

        const user = users[0];

        // Şifreyi kontrol et
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Geçersiz email veya şifre' });
        }

        // Token oluştur
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                is_admin: user.is_admin 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kategorileri getir
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await db.execute(
            'SELECT * FROM categories WHERE is_active = TRUE ORDER BY name'
        );
        res.json(categories);
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Ürünleri getir
app.get('/api/products', async (req, res) => {
    try {
        const { category, featured, limit, page = 1 } = req.query;
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.is_active = TRUE
        `;
        const params = [];

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (featured === 'true') {
            query += ' AND p.is_featured = TRUE';
        }

        query += ' ORDER BY p.created_at DESC';

        if (limit) {
            const offset = (parseInt(page) - 1) * parseInt(limit);
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(limit), offset);
        }

        const [products] = await db.execute(query, params);
        res.json(products);
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Tek ürün getir
app.get('/api/products/:slug', async (req, res) => {
    try {
        const [products] = await db.execute(
            `SELECT p.*, c.name as category_name, c.slug as category_slug 
             FROM products p 
             JOIN categories c ON p.category_id = c.id 
             WHERE p.slug = ? AND p.is_active = TRUE`,
            [req.params.slug]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Product error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Sepet işlemleri
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const [cartItems] = await db.execute(
            `SELECT c.*, p.name, p.price, p.discount_price, p.image_url, p.slug
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [req.user.id]
        );
        res.json(cartItems);
    } catch (error) {
        console.error('Cart error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Ürün var mı kontrol et
        const [products] = await db.execute(
            'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        // Sepette var mı kontrol et
        const [existingItem] = await db.execute(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.id, productId]
        );

        if (existingItem.length > 0) {
            // Miktarı güncelle
            await db.execute(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.user.id, productId]
            );
        } else {
            // Yeni ürün ekle
            await db.execute(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, productId, quantity]
            );
        }

        res.json({ message: 'Ürün sepete eklendi' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.put('/api/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (quantity <= 0) {
            // Ürünü sepetten kaldır
            await db.execute(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [req.user.id, productId]
            );
        } else {
            // Miktarı güncelle
            await db.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.user.id, productId]
            );
        }

        res.json({ message: 'Sepet güncellendi' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
    try {
        await db.execute(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.id, req.params.productId]
        );
        res.json({ message: 'Ürün sepetten kaldırıldı' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Site içeriklerini getir
app.get('/api/content/:key', async (req, res) => {
    try {
        const [contents] = await db.execute(
            'SELECT * FROM site_contents WHERE page_key = ? AND is_active = TRUE',
            [req.params.key]
        );

        if (contents.length === 0) {
            return res.status(404).json({ error: 'İçerik bulunamadı' });
        }

        res.json(contents[0]);
    } catch (error) {
        console.error('Content error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Admin Routes
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [products] = await db.execute(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             JOIN categories c ON p.category_id = c.id 
             ORDER BY p.created_at DESC`
        );
        res.json(products);
    } catch (error) {
        console.error('Admin products error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name, description, shortDescription, price, discountPrice,
            stockQuantity, categoryId, brand, model, color, storage,
            imageUrl, toslaUrl, isFeatured
        } = req.body;

        const slug = name.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const [result] = await db.execute(
            `INSERT INTO products (name, slug, description, short_description, price, 
             discount_price, stock_quantity, category_id, brand, model, color, storage, 
             image_url, tosla_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, shortDescription, price, discountPrice,
             stockQuantity, categoryId, brand, model, color, storage,
             imageUrl, toslaUrl, isFeatured || false]
        );

        res.status(201).json({ message: 'Ürün başarıyla eklendi', id: result.insertId });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, description, shortDescription, price, discountPrice,
            stockQuantity, categoryId, brand, model, color, storage,
            imageUrl, toslaUrl, isFeatured, isActive
        } = req.body;

        await db.execute(
            `UPDATE products SET name = ?, description = ?, short_description = ?, 
             price = ?, discount_price = ?, stock_quantity = ?, category_id = ?, 
             brand = ?, model = ?, color = ?, storage = ?, image_url = ?, 
             tosla_url = ?, is_featured = ?, is_active = ? WHERE id = ?`,
            [name, description, shortDescription, price, discountPrice,
             stockQuantity, categoryId, brand, model, color, storage,
             imageUrl, toslaUrl, isFeatured, isActive, id]
        );

        res.json({ message: 'Ürün başarıyla güncellendi' });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Ürün başarıyla silindi' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Admin kullanıcılar
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, first_name, last_name, email, phone, is_admin, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Admin içerik güncelleme
app.put('/api/admin/content/:key', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, content, metaDescription } = req.body;
        
        await db.execute(
            'UPDATE site_contents SET title = ?, content = ?, meta_description = ? WHERE page_key = ?',
            [title, content, metaDescription, req.params.key]
        );

        res.json({ message: 'İçerik başarıyla güncellendi' });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Selvi GSM API çalışıyor' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
});

// Server'ı başlat
async function startServer() {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Selvi GSM API ${PORT} portunda çalışıyor`);
        console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
    });
}

startServer().catch(console.error);