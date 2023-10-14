const { MongoClient } = require('mongodb');
const express = require("express");
const app = express();
const cors = require('cors')

// const url = 'mongodb+srv://Miqueias:falliscoming@cluster-amazonia.ju1blud.mongodb.net/Lendas-da-Amazonia';
// const dbName = 'Lendas-da-Amazonia';
// const userCollection = 'user';
// const lendCollection = 'lenda';
// const testeCollection = 'teste'; 
require('dotenv').config();
const port = process.env.PORT || 3001;

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB_NAME;
const userCollection = process.env.MONGODB_USER_COLLECTION;
const lendCollection = process.env.MONGODB_LEND_COLLECTION;
const testeCollection = process.env.MONGODB_TESTE_COLLECTION;
// Nome da coleção de usuários
const multer = require('multer');


app.use(express.json());
app.use(cors());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Rota para fazer o upload de imagens
  app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
      const imagePath = req.file.path;
      const titulo = req.body.titulo; // Captura o título do corpo da requisição
      inserirTeste({ titulo, imagePath }); // Chama a função para inserir no MongoDB
  
      res.json({ message: 'Imagem enviada com sucesso', imagePath });
    } else {
      res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }
  });
  
  // Função para inserir os dados na coleção 'teste' no MongoDB
  async function inserirTeste(data) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      console.log('Conectado ao banco de dados');
  
      const db = client.db(dbName);
      const collection = db.collection(testeCollection);
  
      const result = await collection.insertOne(data);
      console.log(`Dados inseridos com sucesso. ID: ${result.insertedId}`);
    } catch (err) {
      console.error('Erro ao inserir os dados:', err);
    } finally {
      client.close();
      console.log('Conexão fechada');
    }
  }
  

// Função para inserir um usuário no MongoDB
async function inserirUsuario(usuario) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Conectado ao banco de dados');

        const db = client.db(dbName);
        const collection = db.collection(userCollection);

        const result = await collection.insertOne(usuario);
        console.log(`Usuário inserido com sucesso. ID: ${result.insertedId}`);
    } catch (err) {
        console.error('Erro ao inserir o usuário:', err);
    } finally {
        client.close();
        console.log('Conexão fechada');
    }
}
async function inserirLenda(lenda) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Conectado ao banco de dados');

        const db = client.db(dbName);
        const collection = db.collection(lendCollection);

        const result = await collection.insertOne(lenda);
        console.log(`Lenda inserido com sucesso. ID: ${result.insertedId}`);
    } catch (err) {
        console.error('Erro ao inserir a lenda:', err);
    } finally {
        client.close();
        console.log('Conexão fechada');
    }
}

app.post("/register", (req, res) => {
    const usuario = {
        nome :req.body.nome,
        email: req.body.email,
        password: req.body.password
    };

    inserirUsuario(usuario);

    res.send({ msg: "Usuário cadastrado com sucesso" });
});
app.post('/create_legend', upload.single('imagem'), (req, res) => {
    const lenda = {
      titulo: req.body.titulo,
      imagem: req.file.filename, // O nome do arquivo carregado
      descricao: req.body.descricao,
      historia: req.body.historia,
    };
  
    inserirLenda(lenda);
  
    res.send({ msg: 'Lenda cadastrada com sucesso' });
});

  


app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});