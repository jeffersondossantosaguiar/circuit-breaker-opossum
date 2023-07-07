# Implementação do Circuit Breaker com a biblioteca Opossum

Este repositório contém um exemplo simples de implementação do padrão Circuit Breaker em uma API Node.js usando a biblioteca Opossum e cache usando o Redis. O Circuit Breaker é um padrão de design usado para melhorar a resiliência e a estabilidade de sistemas distribuídos, evitando chamadas repetidas a serviços externos indisponíveis ou com comportamento anormal.

## Pré-requisitos

Certifique-se de ter o Node.js e o Docker Compose instalado em seu ambiente de desenvolvimento.

## Instalação

1. Clone este repositório:

   ```shell
   $ git clone git@github.com:jeffersondossantosaguiar/circuit-breaker-opossum.git
   $ cd circuit-breaker-opossum

   ```

2. Instale as dependências e inicie do projeto server:

   ```shell
   $ npm install
   $ npm run start
   ```

3. Execute o docker-compose do projeto client:

   ```shell
   $ docker-compose up
   ```

## Como funciona

Neste exemplo, criei uma API Node.js simples usando o framework Express e TypeScript. Implementamos um endpoint no `client` que faz uma chamada a uma API para o `server` usando o Axios. O Circuit Breaker é implementado usando a biblioteca Opossum.

Quando uma solicitação é feita ao `server`, o Circuit Breaker envolve a chamada ao serviço externo e monitora as respostas. Se o serviço externo estiver indisponível ou apresentar um comportamento anormal, o Circuit Breaker ativará um fallback, retornando uma resposta alternativa sem chamar o serviço externo (cache).

As configurações do Circuit Breaker, como tempo limite, limite de erro e tempo de espera para reabrir o circuito, podem ser ajustadas no arquivo `client\server.ts` de acordo com as necessidades.

## Como usar

1. Inicie o `server` e o `client`:

   ```shell
   $ npm start

   ```

2. O `client` estará rodando em http://localhost:8080 e o `server` estará rodando em http://localhost:3001. Você pode fazer uma solicitação GET para http://localhost:8080/ para testar o endpoint e observar o funcionamento do Circuit Breaker.

## Recursos adicionais

[Documentação do Opossum](https://github.com/nodeshift/opossum)
