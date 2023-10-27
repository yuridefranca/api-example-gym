ARG IMAGE_VERSION=1.1.0
FROM yuridefranca/nodejs:${IMAGE_VERSION}

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]