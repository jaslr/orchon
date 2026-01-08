FROM alpine:latest

ARG PB_VERSION=0.25.0

# Install dependencies
RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget \
    sqlite

# Download and install PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip -d /pb/ \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip

# Create data directory and migrations directory
RUN mkdir -p /pb/pb_data /pb/pb_migrations

# Copy migrations
COPY pb_migrations/ /pb/pb_migrations/

# Create startup script
RUN echo '#!/bin/sh' > /pb/start.sh && \
    echo 'exec /pb/pocketbase serve --http=0.0.0.0:8080 --migrationsDir=/pb/pb_migrations --origins=https://orchon.pages.dev,https://orchon-3tt.pages.dev,http://localhost:4573,http://localhost:5173' >> /pb/start.sh && \
    chmod +x /pb/start.sh

EXPOSE 8080

CMD ["/pb/start.sh"]
