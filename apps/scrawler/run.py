import subprocess, time, sys

while True:
	subprocess.call(['scrapy', 'crawl', 'NCHU', '-a', 'semester='+sys.argv[1]])
	print('-----------------------------------')
	print('start sleep')
	print('-----------------------------------')
	time.sleep(600)
