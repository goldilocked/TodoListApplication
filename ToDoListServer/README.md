# Awesome Project Build with TypeORM
// this section autocreated

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

// this section created by me

# Database setup
// TODO: give more detail here
1. docker pull postgres
2. docker run --name todoListPostgres -e POSTGRES_PASSWORD=<yourpassword> -p 5432:5432 -d postgres
// TODO: create .env example file
3. create .env file
4. run migrations by running `x typeorm-ts-node-commonjs migration:run -d src/data-source.ts`
