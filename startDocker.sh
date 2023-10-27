#!/usr/bin/env bash
eval $(cat .env)

while getopts b argument; do
	case "${argument}" in
	b) build=true ;;
	esac
done

# caso não exista um arquivo .env cria um a partir do .env.example
FILE=./.env
if [ ! -f "$FILE" ]; then
    cp .env.example .env
fi

# faz o build da imagem do projeto caso ainda nao tenha
if [[ "$(docker images -q $PROJECT_NAME/nodejs:latest 2> /dev/null)" == "" || $build == "true" ]]; then
    docker-compose up -d --build;
else
    docker-compose up -d;
fi

docker-compose logs -f

docker-compose exec app zsh
