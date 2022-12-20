# Dream-Builder

Run docker-containers
```
docker-compose up
```

Run unittests for apis
```
sudo docker-compose -f docker-compose.yml -f \
tests/docker-compose.test.yml up --abort-on-container-exit \
--exit-code-from testrunner 
```