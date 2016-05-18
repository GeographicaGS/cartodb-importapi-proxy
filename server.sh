#!/bin/bash

function build(){
  docker-compose build
}

function prerequisites(){
  git pull
}

case $1 in
  start)
    docker-compose start
    nginx restart
    shift
    ;;
    
  restart)
    docker-compose stop
    docker-compose start
    nginx restart
    shift # past argument=value
    ;;

  refresh)
    prerequisites;
    build;
    docker-compose stop
    docker-compose rm -f
    docker-compose up -d
    nginx restart
    shift
    ;;

  stop)
    docker-compose stop

    shift
    ;;
  *)
      echo "Bad parameters"
      exit
    ;;
esac