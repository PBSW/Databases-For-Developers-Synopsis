#! /usr/bin/python3

csv_dataset = 'https://files.mbarth.dk/datasets/SpotifyCharts/split.csv.zip'
json_dataset = 'https://files.mbarth.dk/datasets/SpotifyCharts/split.json.zip'
sql_backup = ''

option_get_csv = True
option_get_json = True
option_get_sql = False

option_unpack_zip = False
option_outdir = '../data/'

import os
import sys
import requests

dirname = os.path.join(os.path.dirname(__file__), option_outdir)
if not os.path.exists(dirname):
    os.makedirs(dirname)

def download_file(url):
    filename = url.split('/')[-1]
    local_filename = os.path.join(dirname, filename)
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        content_length = r.headers.get('Content-Length') 
        if content_length is None:
            content_length = 0
        read_count = 0
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                read_count += 8192
                msg = f" {filename:25} Downloading {(read_count / int(content_length))*100:3.0f}%"
                print(msg + " " * 100, end='\r\r')
                sys.stdout.flush()
                f.write(chunk) 
            print(f" {filename:25} Downloaded" + " " * 100 , end='\n')
            
    return local_filename


if option_get_csv:
    download_file(csv_dataset)
if option_get_json:
    download_file(json_dataset)
if option_get_sql:
    download_file(sql_backup)
