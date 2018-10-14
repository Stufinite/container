FROM ubuntu:16.04

MAINTAINER Dockerfiles

# Install required packages and remove the apt packages cache when done.

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 \
    && echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

RUN apt-get update && \
    apt-get upgrade -y && \ 	
    apt-get install -y \
	git vim \

	python3.4 python3-dev python3-setuptools python3-pip virtualenv \
    uwsgi uwsgi-plugin-python uwsgi-plugin-python3 \

	nginx supervisor \

    sqlite \
    mongodb-org \
    redis-server \

    libssl-dev libffi-dev \

    memcached libmemcached-dev \

    && { \
        echo debconf debconf/frontend select Noninteractive; \
        echo mysql-community-server mysql-community-server/data-dir \
            select ''; \
        echo mysql-community-server mysql-community-server/root-pass \
            password 'suckmydick87'; \
        echo mysql-community-server mysql-community-server/re-root-pass \
            password 'suckmydick87'; \
        echo mysql-community-server mysql-community-server/remove-test-db \
            select true; \
    } | debconf-set-selections \
    && apt-get install -y mysql-server libmysqlclient-dev \

    && rm -rf /var/lib/apt/lists/*

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx/cal.conf /etc/nginx/sites-enabled/default
COPY nginx/inferno.conf /etc/nginx/sites-enabled/inferno
COPY supervisor/* /etc/supervisor/conf.d/


# setup Cal
COPY apps/cal /home/docker/code/cal
RUN virtualenv -p python3 /home/docker/code/cal/venv
RUN /bin/bash -c "source /home/docker/code/cal/venv/bin/activate && pip install -r /home/docker/code/cal/requirements.txt && deactivate"
COPY ./db_backup/cal.sqlite3 /home/docker/code/cal/cal/db.sqlite3

# setup Inferno
COPY apps/inferno /home/docker/code/inferno
COPY apps/slothTw /home/docker/code/slothTw
RUN virtualenv -p python3 /home/docker/code/inferno/venv
RUN /bin/bash -c "source /home/docker/code/inferno/venv/bin/activate && pip install -r /home/docker/code/inferno/requirements.txt && deactivate"
COPY ./db_backup/inferno.sqlite3 /home/docker/code/inferno/inferno/db.sqlite3

COPY apps/scrawler /home/docker/code/scrawler
RUN virtualenv -p python3 /home/docker/code/scrawler/venv
RUN /bin/bash -c "source /home/docker/code/scrawler/venv/bin/activate && pip install -r /home/docker/code/scrawler/requirements.txt && deactivate"

EXPOSE 80
CMD ["supervisord", "-n"]

# prepare env for MongoDB
RUN /bin/bash -c "mkdir -p /data/db"
