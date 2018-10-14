# scrawler 學校課程資訊爬蟲

`school` + `crawler` 的簡稱 = `scrawler`

scrawler 是各大學的課程資訊爬蟲
目前支援：
1. 中興

每次更新課程後  
會自動匯入django所指定的資料庫  如Mysql  
以及建立所有[cal](https://github.com/stufinite/cal)所需要查詢的表  
省去複雜的步驟，讓維護`cal`變得輕鬆

建立的表如下：
1. Django中`timetable.models.Course`
2. MongoDB中`CourseOfDept`
3. MongoDB中`CourseOfTime`

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities

1. OS：Ubuntu / OSX would be nice
2. environment：need python3
`sudo apt-get update; sudo apt-get install; python3 python3-dev`
3. 需要`mongoDB`:
  * Ubuntu:請看這篇[安裝教學](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)
  * mac：請看這篇[安裝教學](https://blog.gtwang.org/mac-os-x/mac-os-x-install-mongodb-database/)
4. lxml dependencies
`sudo apt-get install libxml2-dev libxslt-dev`
5. cryptography dependencies
`sudo apt-get install libssl-dev libffi-dev`

### Installing

1. `git clone https://github.com/stufinite/scrawler`
2. 使用虛擬環境：
  1. `virtualenv venv`
  2. 啟動方法
    1. for Linux：`. venv/bin/activate`
    2. for Windows：`venv\Scripts\activate`
3. `pip install -r requirements.txt`

## 行前須知：
1. 請確保`mongodb`是啟動的，啟動mongoDB的指令為  
  * ubuntu：`sudo systemctl start mongod.service`  
  * macOS：`不確定`
2. `scralwer/settings.py`的96行，請更新`cal`專案在該環境的絕對路徑，否則會無法存取資料到`cal`的資料庫中。


## Running & Testing

## Run

* `scrapy crawl NCHU -a semester=學期(1061 or 1062 or ...)`：個人開發時使用
* `nohup python run.py 學期(1061 or 1062 or ...) &`：佈署到伺服器時使用  
  因為`run.py`是一個無限回圈，所以讓他在背景執行即可  
  效果：看到`start sleep`且上方沒有任何`error`就是正常  
  ```
    以上省略多行
    ...
   'item_scraped_count': 6,
   'log_count/DEBUG': 14,
   'log_count/INFO': 7,
   'response_received_count': 7,
   'scheduler/dequeued': 6,
   'scheduler/dequeued/memory': 6,
   'scheduler/enqueued': 6,
   'scheduler/enqueued/memory': 6,
   'start_time': datetime.datetime(2017, 2, 6, 13, 48, 44, 579855)}
  2017-02-06 21:48:53 [scrapy.core.engine] INFO: Spider closed (finished)
  -----------------------------------
  start sleep
  -----------------------------------

  ```

### Break down into end to end tests

目前還沒寫測試...

### And coding style tests

目前沒有coding style tests...

### Results


## Built With

* Scrapy
* scrapy-djangoitem

## Contributors

* **張泰瑋** [david](https://github.com/david30907d)

## License

## Acknowledgments
