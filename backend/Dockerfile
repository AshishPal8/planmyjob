FROM oven/bun:1
WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD [ "bun", "src/index.ts" ]