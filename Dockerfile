FROM debian:bullseye-slim AS builder

ARG HUGO_VERSION=0.102.3

RUN apt-get update && apt-get install -y --no-install-recommends wget ca-certificates && \
    ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "arm64" ]; then HUGO_ARCH="Linux-ARM64"; else HUGO_ARCH="Linux-64bit"; fi && \
    wget -O hugo.tar.gz "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_${HUGO_ARCH}.tar.gz" && \
    tar -xzf hugo.tar.gz -C /usr/local/bin && \
    rm hugo.tar.gz && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .

RUN hugo --minify

FROM nginx:alpine

COPY --from=builder /src/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
