# zx-sev

## docker

``` bash
docker build -t joe/zx-sev:1.0.0 .
docker run -d -p 3000:3000 --link mongo:mongo --env DB_HOST=mongo --name zx-sev joe/zx-sev:1.0.0

// 修改时区
docker exec -it zx-sev /bin/bash
date -R
tzselect
5 → 回车 → 9 → 回车 → 1 → 回车 → 1
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
