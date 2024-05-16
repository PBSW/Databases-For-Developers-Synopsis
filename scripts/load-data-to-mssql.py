#! /usr/bin/python3

# dir files
import os
import GetDataSets
from zipfile import ZipFile 

files: list[str]
option_data_dir = '../data/'

dirname = os.path.join(os.path.dirname(__file__), option_data_dir)

def unpack_zip(retry = True) -> list[str]:
    if not os.path.exists(os.path.join(dirname, 'split.csv.zip')):
        GetDataSets.option_outdir = option_data_dir
        GetDataSets.download_file(GetDataSets.csv_dataset)
    
    try:
        with ZipFile(file=os.path.join(dirname, 'split.csv.zip'), mode='r') as zObject: 
            elements = zObject.filelist
            count = elements.__len__()
            if count <= 0: 
                count = 1
            foldernames : list[str] = []
            for idx, element in enumerate(elements):
                if element.is_dir():
                    foldernames.append(element.filename)
                    continue
                
                # we use a flat structure so we remove any folder information
                if not os.path.exists(os.path.join(dirname, 'csv', os.path.basename(element.filename))):
                    out_file_path = zObject.extract(element.filename, os.path.join(dirname, 'csv'))
                    filename = os.path.basename(out_file_path)
                    os.rename(out_file_path, os.path.join(dirname, 'csv', filename))
                
                # print progress
                msg = f" Unpacking zip - Progress {(idx / (int(count)))*100:3.0f}%"
                print(msg + " " * 100, end='\r')
            
            for dir in foldernames:
                full_path = os.path.join(dirname, 'csv', dir)
                if os.path.exists(full_path):
                    os.removedirs(full_path)
                
            print("Unpacking zip - Finished" + " " * 100)
            files = os.listdir(os.path.join(dirname, 'csv'))
            files.sort()
            return files
    except:
        os.remove(os.path.join(dirname, 'split.csv.zip'))
        if retry:
            return unpack_zip(False)            

files = unpack_zip()

for file in files:
    pass
    #print(file)
    
sql_insert_data = """
-- import the file
BULK INSERT dbo.SpotifyDataset
FROM '{0}'
WITH
(
        FORMAT='CSV',
        FIRSTROW=2
)
GO
"""

sql_create = """
-- create table
CREATE TABLE IF NOT EXIST dbo.SpotifyDataset
GO 

-- truncate the table in case it has any data
TRUNCATE TABLE dbo.SpotifyDataset;
GO
"""