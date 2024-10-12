## AniJourney

O AniJourney é um site voltado para os amantes de animes, sendo possível explorar sua jornada pelo mundo dos animes. Veja a documentação completa da API no [SwaggerHub](https://app.swaggerhub.com/apis/PEDROHENRIQUEQLDEV/AniJourneyAPI/1.0.0-oas3.1).

## Requisitos

[Node.js v20.11.0](https://nodejs.org/en/download/)
[pnpm v9.12.1](https://pnpm.io/installation)
[Docker](https://docs.docker.com/engine/install/)
[Docker Compose](https://docs.docker.com/compose/install/)

## Recursos Principais

- Explorar Animes: Navegar por uma vasta coleção de animes, com informações detalhadas sobre cada anime: sinopse, gêneros, status, etc.
- Marcar Assistidos: Manter o controle dos animes que você já assistiu ou que estão em andamento, marcando em qual episódio você parou.
- Planejar para Assistir: Criar uma lista de animes que você pretende assistir no futuro.
- Avaliações: Avaliar os animes que você já assistiu, além de visualizar a avaliação média do anime.

## Desenvolvimento

1. Clone o repositório:

   ```bash
   git clone git@github.com:pedrohenrique-ql/ani-journey.git
   cd ani-journey
   ```

2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Inicie o banco de dados PostgreSQL:

   ```bash
   pnpm deps:up
   ```

4. Aplique as migrations:

   ```bash
   pnpm deps:prepare
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   pnpm dev
   ```

## Testes

Para rodar os testes, execute:

```bash
pnpm test
```
