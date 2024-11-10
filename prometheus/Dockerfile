FROM prom/prometheus:v${PROMETHEUS_VERSION}

ARG RENDER_SERVICE_NAME

# Create the directory (skip chown if Prometheus can run as root in this setup)
RUN mkdir -p /var/data/prometheus

# Replace RENDER_SERVICE_NAME in the config
ADD prometheus.yml /etc/prometheus/
RUN sed -i "s/RENDER_SERVICE_NAME/${RENDER_SERVICE_NAME}/g" /etc/prometheus/prometheus.yml

CMD [ "--storage.tsdb.path=/var/data/prometheus", \
      "--config.file=/etc/prometheus/prometheus.yml", \
      "--web.console.libraries=/usr/share/prometheus/console_libraries", \
      "--web.console.templates=/usr/share/prometheus/consoles" ]
