// Função assíncrona para buscar usuários do servidor
async function fetchUsers() {
    const response = await fetch('/get-users'); // Faz uma requisição GET para obter a lista de usuários
    const users = await response.json(); // Converte a resposta em JSON

    const userList = document.getElementById('users'); // Seleciona o elemento HTML onde os usuários serão exibidos
    userList.innerHTML = ''; // Limpa o conteúdo existente

    // Itera sobre cada usuário retornado e cria um item de lista
    users.forEach(user => {
        const listItem = document.createElement('li'); // Cria um novo elemento de lista
        listItem.classList.add('list-group-item'); // Adiciona uma classe para estilização
        // Define o texto do item da lista com as informações do usuário
        listItem.textContent = `Registro: ${user.regd_no}, Nome: ${user.name}, Email: ${user.email}, Curso: ${user.branch}`;
        userList.appendChild(listItem); // Adiciona o item da lista ao elemento de usuários
    });
}

// Chama a função fetchUsers quando o conteúdo da página estiver totalmente carregado
document.addEventListener('DOMContentLoaded', fetchUsers);

// Adiciona um listener de evento para o formulário de comparação
document.getElementById('compareForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Impede o comportamento padrão do envio do formulário
    const formData = new FormData(this); // Cria um FormData a partir do formulário
    const data = Object.fromEntries(formData.entries()); // Converte FormData em um objeto

    // Faz uma requisição POST para comparar os dados do usuário
    const response = await fetch('/compare', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Define o cabeçalho de conteúdo como JSON
        },
        body: JSON.stringify(data) // Envia os dados do formulário como JSON
    });

    const result = await response.json(); // Converte a resposta em JSON
    const resultDiv = document.getElementById('result'); // Seleciona o elemento para exibir o resultado
    // Verifica se o usuário foi encontrado e atualiza o conteúdo do resultado
    if (result.exists) {
        resultDiv.innerHTML = `<p>Usuário encontrado: Nome: ${result.user.name}, Email: ${result.user.email}</p>`;
    } else {
        resultDiv.innerHTML = `<p>Nenhum usuário encontrado com Nome: ${data.name} e Email: ${data.email}.</p>`;
    }
});
