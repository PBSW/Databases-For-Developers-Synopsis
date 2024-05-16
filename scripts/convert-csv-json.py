#!/usr/bin/python3

import csv, json, os; 

ifolder = '/home/mads/Downloads/SpotifyCharts.csv/'
ofolder = '/home/mads/Downloads/SpotifyCharts.json/'

# function to convert a CSV to JSON
def make_json(csvFilePath, jsonFilePath):
    data = {}
    with open(csvFilePath, encoding='utf-8') as csvf:
        data = [dict(r) for r in csv.DictReader(csvf)]
        
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

# dir files
files: list[str] = os.listdir(ifolder)

for ifile in files:
    print('processing: ' + ifile)
    ipath = os.path.join(ifolder, ifile)
    opath = os.path.join(ofolder, ifile.replace('.csv', '.json'))
    make_json(ipath, opath)
    