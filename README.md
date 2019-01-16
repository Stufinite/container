# container

execute:
docker run -d -p 80:80 cal

## Deploy

### cal

1. migrate cal: `python3 manage.py migrate`
2. run scrawler: `python3 run.py <semester: e.q. 1071>`
3. 把學校的系所資料匯入資料庫中：`cd cal; python manage.py buildDept NCHU`

### 每學期更新學期代碼

1. <https://github.com/Stufinite/container/blob/45bebec416cbea2e33d6c0af87510e2fbba72be3/apps/cal/cal/static/timetable/js/page.js#L159>
2. <https://github.com/Stufinite/container/blob/45bebec416cbea2e33d6c0af87510e2fbba72be3/apps/cal/cal/static/timetable/js/page.js#L187>
3. <https://github.com/Stufinite/container/blob/45bebec416cbea2e33d6c0af87510e2fbba72be3/apps/cal/cal/static/timetable/js/Timetable.js#L4>

### 更新系所JSON

1. cal: <https://github.com/Stufinite/container/blob/master/apps/cal/cal/static/timetable/json/NCHU/Department.json>
2. scrawler: <https://github.com/Stufinite/container/blob/c71542754379c0dd52ddaac38e614baa867abddd/apps/scrawler/scrawler/spiders/NCHU/department.json>


### inferno

1. <https://github.com/Stufinite/inferno>
2. bower install完之後記得把`bower_components/` 給 copy進`../static`資料夾中
3. 去cloudflare按purge everything