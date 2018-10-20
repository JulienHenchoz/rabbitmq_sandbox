# Ideative microservices
This repository contains several microservices that communicate together using RabbiqMQ.

## Build & deploy
- `yarn build` to build and push all workers to the Docker registry
- `yarn build worker_name` to build and push `worker_name` worker to the Docker registry

## Backlog
#### Common :
- Way to identify the client request (billing)

#### Microservices : 
- Predominant colors of an image (with color name, RGB, HEX)
- Image labelling
- Identify who used this microservice (billing)
- LetsEncrypt SSL certificate generator (MAMP HTTPS)
