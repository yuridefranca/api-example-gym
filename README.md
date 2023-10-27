# NodeJs API Example

This repository contains an API made only using NodeJs without any 3rd part library or framework. For this example I chose to build a simple gym API that can manipulate workouts and exercicies.  

<br>

## Features
- [Excercises](./requirements/exercises.md)

<br>

## Documentation

<br>

## Pre-requisite
To run this project in you local you will need the following tools:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

<br>

## References
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Gitmoji](https://gitmoji.dev/)
- [Nodejs - Crypto](https://nodejs.org/api/crypto.html)
- [Nodejs - Filesystem](https://nodejs.org/api/fs.html)
- [Nodejs - Http](https://nodejs.org/api/http.html)
<br>

## Modo de usar
``` bash
# Clone o repositório
$ git clone git@github.com:yuridefranca/api-example-gym.git

# Entre no diretório raiz do projeto
$ cd api_example_gym

# Execute o seguinte comando para iniciar o docker
$ ./startDocker.sh

# Execute a aplicação em modo de desenvolvimento
$ yarn start:dev

# O servidor inciará na porta definida no arquivo .env na variável "DOCKER_APP_PORT" por padrão está definido como 80 - acesse <http://localhost:80>
```

<br>
