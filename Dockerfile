# Local run of the site against the production backend (see `make docker-prod`).
# Not used by Vercel, which builds with `npm run build`.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts
COPY . .
ARG NG_CONFIGURATION=azure
RUN node scripts/build.mjs --configuration "$NG_CONFIGURATION"

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/nextjedi-app-portfolio/browser /usr/share/nginx/html
EXPOSE 80
