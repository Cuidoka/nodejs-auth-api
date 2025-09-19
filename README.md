# API de Autenticação - Treinamento Flutter + Node.js

Esta é uma API REST desenvolvida em Node.js com Express para servir como backend para um aplicativo de autenticação de usuários. A API gerencia o registro, login e a renovação de sessões utilizando JWT (Access Tokens e Refresh Tokens).

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
*   [Node.js](https://nodejs.org/en/) (versão 18+ recomendada)
*   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
*   [Postman](https://www.postman.com/) (para testar os endpoints)

## Instalação e Setup

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1.  **Clone o repositório:**
    ```bash
    git clone <https://github.com/Cuidoka/nodejs-auth-api>
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd nome-da-pasta-do-projeto
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis. Substitua os valores por segredos seguros.

    ```env
    # Segredo para o Access Token (curta duração)
    JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO_AQUI

    # Segredo para o Refresh Token (longa duração)
    REFRESH_TOKEN_SECRET=SEU_OUTRO_SEGREDO_MAIS_SECRETO_AINDA

    # Porta em que o servidor irá rodar
    PORT=3000
    ```

## Como Executar o Servidor

Após a instalação, você pode iniciar o servidor com o seguinte comando:

```bash
node index.js
```

O terminal deverá exibir a mensagem: API rodando na porta 3000.


# Agora vamos configurar o seu POSTMAN!!

## Endpoints da API

Crie uma nova coleção `My Collection` 
Abaixo está a lista de endpoints disponíveis na API.

### Autenticação

**POST /api/auth/register** 
Descrição: Registra um novo usuário no sistema. 
Corpo da Requisição (Body) (RAW):
```
{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha-do-usuario"
}
```
Cria outro:
**POST /api/auth/login**  
Descrição: Autentica um usuário e retorna um accessToken e um refreshToken. 
Corpo da Requisição (Body) (RAW):
```
{
    "email": "usuario@email.com",
    "password": "senha-do-usuario"
}
```
**POST /api/auth/refresh** 
Descrição: Gera um novo accessToken a partir de um refreshToken válido. 
Corpo da Requisição (Body) (RAW):
```
{
    "refreshToken": "seu-refresh-token-aqui"
}
```

**GET /api/auth/me** 
Descrição: Retorna os dados do usuário autenticado. Rota protegida. 
Autorização: Requer um accessToken no cabeçalho. 
Tipo: Bearer Token
```
Token: seu-access-token-aqui
```

Configurado o seu **POSTMAN!**


---

### Desafio para Você

Agora que você tem um `README.md` completo para o backend, o desafio é criar um para o seu **projeto Flutter**.

A estrutura será parecida, mas as seções de "Instalação" e "Como Executar" serão diferentes. Pense no que um desenvolvedor precisaria saber:
*   **Pré-requisitos:** Flutter SDK.
*   **Instalação:** `flutter pub get`.
*   **Como Executar:** `flutter run` ou `flutter run -d chrome` (Caso queira executar no Chrome direto).
*   **Observação Importante:** Mencionar que a API backend precisa estar rodando e, se necessário, ajustar o IP no `api_service.dart` (de `localhost` para `10.0.2.2` para o emulador Android).

Tente criar esse arquivo. É o exercício perfeito para consolidar o que você aprendeu.
