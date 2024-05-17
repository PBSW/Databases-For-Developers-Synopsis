#! /usr/bin/python3

# dir files
from itertools import islice
import os
import re
import sys
import GetDataSets
from zipfile import ZipFile 
import sqlalchemy
import sql_snippets

files: list[str]
option_data_dir = '../data/'

dirname = os.path.join(os.path.dirname(__file__), option_data_dir)

def convert_array_csv_to_ssv(filename, lines : list[str]) -> list[str]:
    """
    * csv - comma separated values
    * ssv - semicolon separated values
    """
    result : list[str] = []
    count = lines.__len__()
    lines_without_a_match = 0
    for idx, line in enumerate(lines):
        if (idx % 200 == 0):
            msg = f" {filename} - Progress {(idx / (int(count)))*100:3.0f}%"
            print(msg + " " * 100, end='\r')
            sys.stdout.flush()
        match = re.search(r"\[[A-Z,'\s]*\]", line)
        if match is not None:
            substring = match.string[match.start():match.end()]
            line = line.replace(substring, substring.replace(',', ";"))
        else:
            lines_without_a_match += 1
        if (lines_without_a_match >= 5):
            print(f"{filename} - Skipped" + " " * 100)
            return lines
        result.append(line)
    print(f"{filename} - Finished" + " " * 100)
    return result

def convert(folder, files):
    for file in files:
        with open(os.path.join(folder, file), mode="r+", encoding='utf-8') as f:
            # skip files that already have been processed
            samples = list(islice(f, 10_000))
            skip_file = True
            for sample in samples:
                match = re.search(r"\[[A-Z,'\s]*\]", sample)
                if match is not None:
                    skip_file = False
                    break
            if skip_file:
                continue
            
            # reset file pointer
            f.seek(0)
            lines = f.readlines()

            text = convert_array_csv_to_ssv(file, lines)
            
            # write new data
            f.seek(0)
            f.truncate()
            f.writelines(text)
        return

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
        else:
            raise "FAILED TO UNPACK THE DATASET - possible reasons include: no remote zipfile, corrupted zipfile"

def main():
    files = unpack_zip()
    convert(os.path.join(dirname, 'csv'), files)
    return
    engine = sqlalchemy.create_engine(f'mssql+pymssql://sa:!123456Aab@localhost:1434', connect_args = {'autocommit':True})

    with engine.connect() as connection:
        connection.exec_driver_sql(sql_snippets.sql_create_db)
        connection.exec_driver_sql(sql_snippets.sql_create_base_table)

        for file in files:
            connection.exec_driver_sql(sql_snippets.sql_insert_data.format(f"/var/home/data/{file}"))

if __name__ == "__main__":
    main()
