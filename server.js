require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'segredo123',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        if (req.user.isAdmin) {
            res.redirect('/painel.html');
        } else {
            res.send('<h1>Acesso Negado</h1><p>Apenas o ADM pode acessar este sistema.</p><a href="/logout">Sair</a>');
        }
    }
);

app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) return next();
    res.status(403).json({ error: 'Não autorizado' });
};

app.get('/api/dados', checkAuth, (req, res) => {
    const sql = `
        SELECT 
            s.id as sala_id, s.nome as sala_nome,
            c.id as chave_id, c.tipo, c.status, c.usuario_nome, c.usuario_cargo, c.horario
        FROM salas s
        JOIN chaves c ON c.sala_id = s.id
        ORDER BY s.nome, c.tipo
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.put('/api/chaves/:id/emprestar', checkAuth, (req, res) => {
    const { nome, cargo } = req.body;
    const id = req.params.id;
    
    db.query(`UPDATE chaves SET status='ocupada', usuario_nome=?, usuario_cargo=?, horario=NOW() WHERE id=?`, 
    [nome, cargo, id], (err) => {
        if(err) return res.status(500).json(err);
        
        db.query(`SELECT s.nome as sala, c.tipo FROM chaves c JOIN salas s ON s.id=c.sala_id WHERE c.id=?`, [id], (err, rows) => {
            const info = rows[0];
            db.query(`INSERT INTO historico (sala_nome, chave_tipo, acao, usuario_nome) VALUES (?, ?, 'Emprestou', ?)`,
            [info.sala, info.tipo, nome]);
            
            res.json({success: true});
        });
    });
});

app.put('/api/chaves/:id/devolver', checkAuth, (req, res) => {
    const id = req.params.id;
    
    db.query(`SELECT s.nome as sala, c.tipo, c.usuario_nome FROM chaves c JOIN salas s ON s.id=c.sala_id WHERE c.id=?`, [id], (err, rows) => {
        const info = rows[0];
        
        db.query(`UPDATE chaves SET status='livre', usuario_nome=NULL, usuario_cargo=NULL, horario=NULL WHERE id=?`, [id], (err) => {
            if(err) return res.status(500).json(err);
            
            db.query(`INSERT INTO historico (sala_nome, chave_tipo, acao, usuario_nome) VALUES (?, ?, 'Devolveu', ?)`,
            [info.sala, info.tipo, info.usuario_nome]);
            
            res.json({success: true});
        });
    });
});

app.get('/api/usuarios', checkAuth, (req, res) => {
    db.query('SELECT * FROM usuarios ORDER BY nome', (err, rows) => res.json(rows));
});

app.post('/api/usuarios', checkAuth, (req, res) => {
    const { nome, cargo, whatsapp } = req.body;
    db.query('INSERT INTO usuarios (nome, cargo, whatsapp) VALUES (?, ?, ?)', [nome, cargo, whatsapp], 
    (err) => res.json({success: true}));
});

app.delete('/api/usuarios/:id', checkAuth, (req, res) => {
    db.query('DELETE FROM usuarios WHERE id=?', [req.params.id], (err) => res.json({success: true}));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));