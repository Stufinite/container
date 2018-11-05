# 選課小幫手（cal）

智慧行事曆，前身是選課小幫手。  

1. [爬蟲](https://github.com/stufinite/campasscrawler)
2. [搜尋引擎](https://github.com/Stufinite/curso)
3. [課程代碼查詢api](https://github.com/Stufinite/cphelper)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities

1. OS：Ubuntu / OSX would be nice
2. environment：need python3
  * Linux：`sudo apt-get update; sudo apt-get install; python3 python3-dev`
  * OSX：`brew install python3`
3. 需要`mongoDB`:
  * Ubuntu:請看這篇[安裝教學](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)
  * mac：請看這篇[安裝教學](https://blog.gtwang.org/mac-os-x/mac-os-x-install-mongodb-database/)

### Installing

1. `git clone 本專案`
2. 使用虛擬環境：
  1. 創建一個虛擬環境：`virtualenv venv`
  2. 啟動方法
    1. for Linux：`. venv/bin/activate`
    2. for Windows：`venv\Scripts\activate`
3. `pip install -r requirements.txt`

## Running & Testing

## Run

1. 第一次的時候，需要先初始化資料庫：`python manage.py migrate`
2. 把學校的系所資料匯入資料庫中：`python manage.py buildDept NCHU`
3. 切換到 [scrawler](http://github.com/stufinite/scrawler) ，執行 `scrapy crawl NCHU` (詳細操作請看scrawler的README)
4. Execute：`python manage.py runserver`. If it work fine on [here](127.0.0.1:8000) , then it's done. Congratulations~~

### Break down into end to end tests

目前還沒寫測試...

### And coding style tests

目前沒有coding style tests...

### Results

輸入相對應的url pattern就會到相對應的頁面：
1. `127.0.0.1:8000`：就會到選課小幫手的頁面
2. `127.0.0.1:8000/tiagenda`：就會到tiagenda的頁面

## Deployment

There is no difference between other Django project

You can deploy it with uwsgi, gunicorn or other choice as you want

`選課小幫手` 是一般的django專案，所以他佈署的方式並沒有不同

## Built With

* python3.5
* Django==1.10.4

## Versioning

For the versions available, see the [tags on this repository](https://github.com/david30907d/KCM/releases).

## Contributors

* **張泰瑋** [david](https://github.com/david30907d)
* **黃川哲**
* **柯秉廷**

## License

## Acknowledgments
