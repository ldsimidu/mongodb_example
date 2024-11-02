// Importa as bibliotecas necessárias
const express = require('express'); // Framework para construção de aplicações web
const mongoose = require('mongoose'); // Biblioteca para interação com MongoDB
const path = require('path'); // Módulo para manipulação de caminhos de arquivo
const port = 3333; // Porta em que o servidor irá escutar

// Cria uma instância do aplicativo Express
const app = express();

// Middleware para servir arquivos estáticos do diretório atual
app.use(express.static(__dirname));

// Middleware para fazer o parsing de dados de formulários com url-encoded
app.use(express.urlencoded({ extended: true }));

// Conexão ao banco de dados MongoDB
mongoose.connect('mongodb+srv://mongodb:mongodb@cluster0.hta4q.mongodb.net/usuarios?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Evento que é acionado quando a conexão com o MongoDB é bem-sucedida
const db = mongoose.connection;
db.once('open', () => {
    console.log("Conexão com o MongoDB estabelecida!");
});

// Definição do esquema para os usuários
const userSchema = new mongoose.Schema({
    regd_no: String, // Número de registro do usuário
    name: String,    // Nome do usuário
    email: String,   // Email do usuário
    branch: String   // Filial ou departamento do usuário
});

// Modelo para os dados de usuários baseado no esquema definido
const Users = mongoose.model("dados", userSchema);

// Rota GET para servir o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota POST para salvar novos usuários no banco de dados
app.post('/post', async (req, res) => {
    const { regd_no, name, email, branch } = req.body; // Extrai os dados do corpo da requisição
    const user = new Users({ // Cria uma nova instância do modelo Users
        regd_no,
        name,
        email,
        branch
    });
    await user.save(); // Salva o usuário no banco de dados
    res.redirect('/'); // Redireciona para a página inicial após salvar
});

// Rota GET para recuperar todos os usuários do banco de dados e retornar como JSON
app.get('/get-users', async (req, res) => {
    const users = await Users.find(); // Busca todos os usuários
    res.json(users); // Retorna os usuários encontrados em formato JSON
});

// Inicia o servidor e escuta na porta especificada
app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:3333");
});

// Rota POST para realizar login de usuários
app.post('/login', async (req, res) => {
    const { name, email } = req.body; // Extrai os dados do corpo da requisição
    const user = await Users.findOne({ name, email }); // Busca um usuário com o nome e email fornecidos

    // Verifica se o usuário foi encontrado
    if (user) {
        res.send("Login bem-sucedido!"); // Responde com sucesso
    } else {
        res.send("Credenciais inválidas."); // Responde com erro
    }
});
