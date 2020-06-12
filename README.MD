# app-tcxp-backend

Descrição: backend do app tcxp.

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

### Como usar?

	1 - Abra o seu prompt de comando(cmd ou tela preta).<br />

	2 - Navegue até um diretório de sua escolha atravéz do comando `cd NOME DO DIRETÓRIO`.<br />

	3 - Rode o comando `git clone https://github.com/henrique2003/app-tcxp-backend.git` para clonar o app em sua máquina.<br/>

	4 - Após clonar o projeto, entre na pasta raiz do projeto com `cd app-tcxp-backend`.

#### Variáveis ambiente a serem configuradas

Crie um arquivo `.env` na raiz do projeto com as seguintes variáves:

* SECRET_TOKEN - Recebe o `secret` necessário para gerar tokens de autenticação com jwt.<br /><br />
* AWS_KEI_ID - Rebece o `id key` gerado pela amazon, para upload de imagens.<br /><br />
* AWS_SECRET_KEY - Rebece a `secret key` também gerado pela amazon, para upload de imagens.<br /><br />
* AWS_DEFAULT_REGION - Recebe o `region`, que em que região seu serviço AWS estará hospedado.<br /><br />
* AWS_BUCKET - Recebe o `bucket name`, que é o nome do bucket no s3 onde será armazenado suas fotos.<br /><br />
* MAIL_HOST - Recebe o `host` fornecido por um serviço de email, para o envio do deles.<br /><br />
* MAIL_PORT - Recebe o `port` fornecido pelo serviço de email, necessário para o envio deles.<br /><br />
* MAIL_AUTH_USER - Recebe o `user` fornecido pelo serviço de email, necessário para o envio deles.<br /><br />
* MAIL_AUTH_PASS - Recebe o `pass` fornecido pelo serviço de email, necessário para o envio deles.<br /><br />

### Rodando o projeto
Rode os seguintes comandos:
* `npm install` ou `yarn` (instalar as dependencias)
* `npm run dev` ou `yarn dev` (iniciar o projeto)

<br />

Aguarde até que apareça as mensagens abaixo para começar a usar a api:
	
	API runing
	MongoDb conncted...

<br />
