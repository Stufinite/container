# container

execute:
docker run -d -p 80:80 cal

## Deploy

### cal

1. migrate cal: `python3 manage.py migrate`
2. run scrawler: `python3 run.py <semester: e.q. 1071>`

### inferno

1. <https://github.com/Stufinite/inferno>
2. bower install完之後記得把`bower_components/` 給 copy進`../static`資料夾中
3. 去cloudflare按purge everything