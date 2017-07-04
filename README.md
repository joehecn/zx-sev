[![Dependency Status](https://gemnasium.com/badges/github.com/joehecn/zx-sev.svg)](https://gemnasium.com/github.com/joehecn/zx-sev)

# zx-sev

## docker

``` bash
docker build -t joe/zx-sev:1.0.0 .
docker run -d -p 3000:3000 --link zx-db:zx-db --env DB_HOST=zx-db --name zx-sev joe/zx-sev:1.0.0

// 修改时区
docker exec -it zx-sev /bin/bash
date -R
tzselect
5 → 回车 → 9 → 回车 → 1 → 回车 → 1
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
exit
docker stop zx-sev && docker start zx-sev
```

## mongo

### update
https://docs.mongodb.com/manual/reference/command/update/

Output: { n: 0, nModified: 0, ok: 1 }
