# app-viagem-backend

Descrição: backend da aplicação NOMEDAEMPRESA que tem como objetivo juntar pessoas que querem viajar sózinhas e tem o mesmos destinos em mente.

<br />

## Tecnologias usadas

* Node js
* Typescript
* MongoDb

<br />

## Pré-requisitos

* Node js - [download](https://nodejs.org/en/)
* npm - já vem com o Node js ou yarn - instale com `npm install -g yarn`
* MongoDb (Rodando na porta 27017) - [download](https://www.mongodb.com/download-center/community)

<br />

## Como usar?

### Instalação

Abra o seu prompt de comando(cmd ou tela preta) navegue até um diretório de sua escolha atravéz do comando `cd <NOME DO DIRETÓRIO>` e rode o comando `npm clone https://github.com/henrique2003/app-viagem-backend.git` para clonar a aplicação em sua máquina.

Após clonar o projeto, entre na pasta raiz do projeto com `cd app-viagem-backend` e rode os seguintes comandos:

* `npm install` ou `yarn` (instalar as dependencias)
* `npm run dev` ou `yarn dev` (iniciar o projeto)

<br />

Aguarde até que apareça as mensagens abaixo para começar a usar a api:
	
	API runing
	MongoDb conncted...

<br />

### Rotas que não necessitam de nenhum tipo de autenticação

	Criar conta:
	  Método: post 
	  Rota: 'http://localhost:3001/api/users'
	  json:
	  {
        "name": "Marcos",
        "email": "marcos@gmail.com",
        "password": "marcos123"
	  }
		
	Login:
	  Método: post
	  Rota: 'http://localhost:3001/api/login'
	  json:
	  {
        "email": "marcos@gmail.com",
        "password": "marcos123"
	  }

	Ver perfil de outros usuários:
	  Método: get
	  Rota: 'http://localhost:3001/api/user/hd1h452h134n169j04u83'
	  json: null

	Ver todas os grupos de viagem disponíveis:
	  Método: get
	  Rota: '/api/groups'
	  json: null

### Rotas que necessitam de login e confirmação de email

	Alterar informações de perfil do usuário:
	  Método: put
	  Rota: 'http://localhost:3001/api/users'
	  json: 
	  {
        "name": "Marcos",
        "email": "marcos@gmail.com",
        "password": "marcos123",
        "country": "Brasil",
        "state": "São Paulo",
        "city": "São Paulo",
        "celphone": "11 2847-2647"
	  }

	Deletar sua conta:
	  Método: delete
	  Rota: http://localhost:3001/api/users'
	  json: null

<br />

### Criadores

* [Henrique Cristioglu](https://github.com/henrique2003)
