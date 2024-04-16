## Chat (WebSocket)

![Versao React.js](https://img.shields.io/badge/Next.js-14.1.0-orange?style=plastic&logo=nextdotjs&logoColor=white)
![Versao Express.js](https://img.shields.io/badge/Express.js-4.18.3-orange?style=plastic&logo=Express)
![versao TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.3-orange?style=plastic&logo=tailwindcss)

# O que é?

Um chat desenvolvido utilizando Express e Socket.IO no back-end e React.js e Next.js no front-end, possui envio de texto e imagens, mecânica de amigos e grupos e customização de perfil

# Tecnologias utilizadas

- ``Typescript``
- ``Node.js``
- ``Express.js``
- ``Socket.io``
- ``Sequelize.js``
- ``React.js``
- ``Next.js``
- ``TailwindCSS``
- ``Flowbite``
- ``Styled Components``

# Requisitos

- [Node.js](https://nodejs.org/en)
- Um banco de dados. No meu caso, utilizei o [MySQL](https://dev.mysql.com/downloads/mysql/)

# Preparações para executar o projeto

1. Instalar dependências:

    Após fazer download do repositório, é preciso entrar em ambas as pastas Back-end e Front-end e executar o seguinte comando:
    ```
    npm install
    ```
    
2. Configurar seu banco de dados no arquivo ".env".
3. Criar um novo banco de dados com o nome "chatWs" e "chatWs_test".

4. Executar as migrations do projeto e inserir os planos de armazenamento:

    Digite e execute o código abaixo no terminal:
    ```
    npx sequelize-cli db:migrate
    ```
6. Execute o projeto
    
    Abra dois terminais em ambas as pastas Back-end e Front-end e execute o comando:
    ```
    npm run dev
    ```
    
    Abra seu navegador e entre na url: ``127.0.0.1:3000`` ou ``localhost:3000``
