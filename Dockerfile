FROM node:18-alpine AS build

WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn prisma generate
RUN yarn build

USER node

########################################

FROM node:18-alpine AS production

WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package.json /app/yarn.lock ./
COPY --chown=node:node --from=build /app/.env ./.env


ENV NODE_ENV production
CMD ["yarn", "start:prod"]
