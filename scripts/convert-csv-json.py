#!/usr/bin/python3

import os
import csv, json, sys; 

# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath):
     
    # create a dictionary
    data = {}
     
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        data = [dict(r) for r in csv.DictReader(csvf)]
        # Open a json writer, and use the json.dumps() 
        # function to dump data
        
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

# dir files
files: list[str] = os.listdir('/home/mads/Downloads/SpotifyCharts.csv')

for ifile in files:
    print('processing: ' + ifile)
    ipath = '/home/mads/Downloads/SpotifyCharts.csv/' + ifile
    opath = '/home/mads/Downloads/SpotifyCharts.json/' + ifile.replace('.csv', '.json')
    make_json(ipath, opath)
    
