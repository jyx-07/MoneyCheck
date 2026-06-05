# syntax = docker/dockerfile:1
ARG NODE_VERSION=25.9.0
FROM node:${NODE_VERSION}-slim AS base
LABEL fly_launch_runtime="NestJS"
WORKDIR /app
ENV NODE_ENV="production"
ARG PNPM_VERSION=11.5.0
RUN npm install -g pnpm@$PNPM_VERSION

FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# pnpm-workspace.yaml을 package.json과 함께 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .
RUN pnpm run build

FROM base
COPY --from=build /app /app
EXPOSE 3000
CMD [ "pnpm", "run", "start:prod" ]
