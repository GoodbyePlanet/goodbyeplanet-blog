FROM debian:bookworm-slim AS builder

ARG HUGO_VERSION=0.154.4

RUN apt-get update && apt-get install -y --no-install-recommends wget ca-certificates && \
    ARCH=$(dpkg --print-architecture) && \
    wget -O hugo.tar.gz "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${ARCH}.tar.gz" && \
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
