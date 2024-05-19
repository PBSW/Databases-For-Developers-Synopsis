#! /usr/bin/python3

# dir files
import csv
from decimal import Decimal
import os

import sqlalchemy.orm
import sqlalchemy.orm.collections
import sqlalchemy.util
import GetDataSets
from zipfile import ZipFile 
import sqlalchemy
import sql_snippets
from typing import List
from typing import Optional
from sqlalchemy import ForeignKey, insert
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import Numeric, Column, Integer, Table, Unicode
from sqlalchemy.orm import sessionmaker

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
        else:
            raise "FAILED TO UNPACK THE DATASET - possible reasons include: no remote zipfile, corrupted zipfile"

def get_data_from_csv(file) :
    path = os.path.join(dirname, 'csv', file) 
    with open(path, mode="r") as handle:
        reader = csv.reader(handle)
        headers = next(reader)
        
        data = [{h:x for (h,x) in zip(headers,row)} for row in reader]
        
        line_count = data.__len__()
        for index in range(line_count):
            if (index % 50 == 0):
                percentage = (index / (abs(int(line_count)) + 1))*100
                msg = f" Preparing '{file}' - {percentage:2.0f}%"
                print(msg + " " * 100, end='\r')
            props = data[index]
            for key, value in props.items():
                if (value == ""):
                    value = None
                elif key in ["id", "rank", "streams", "popularity", "duration_ms", "af_danceability", "af_energy", "af_key", "af_loudness", "af_mode", "af_speechiness", "af_acousticness", "af_instrumentalness", "af_liveness", "af_valence", "af_tempo", "af_time_signature"]:
                    if value.startswith('\'') or value.startswith('\"'):
                        value = value[1:]
                    if value.endswith('\'') or value.endswith('\"'):
                        value = value[:-1]
                    if value.isnumeric():
                        value = Decimal(value)
                    else:
                        value = None
                elif key in ["title", "date", "release_date", "artist", "url", "region", "chart", "trend", "track_id", "album", "explicit"]:
                    pass
                elif key in ["available_markets"]:
                    pass

                props.update({key: value})
                
            data[index] = props
        return data


engine = sqlalchemy.create_engine(f'mssql+pymssql://sa:!123456Aab@localhost:1434', connect_args = {'autocommit':True}, insertmanyvalues_page_size=500, use_insertmanyvalues=True)

Base = sqlalchemy.orm.declarative_base()
Base.metadata.create_all(engine)
SessionMaker = sessionmaker(bind=engine)

class NewTable(Base):
    __tablename__ = 'BaseTable'
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=False)
    title : Mapped[str]
    rank : Mapped[int]
    date : Mapped[str]
    artist : Mapped[str]
    url : Mapped[str]
    region : Mapped[str]
    chart : Mapped[str]
    trend : Mapped[str]
    streams : Mapped[Decimal]
    track_id : Mapped[str]
    album : Mapped[str]
    popularity : Mapped[Decimal]
    duration_ms : Mapped[Decimal]
    explicit : Mapped[str]
    release_date : Mapped[str]
    available_markets : Mapped[str]
    af_danceability : Mapped[Decimal]
    af_energy : Mapped[Decimal]
    af_key : Mapped[Decimal]
    af_loudness : Mapped[Decimal]
    af_mode : Mapped[Decimal]
    af_speechiness : Mapped[Decimal]
    af_acousticness : Mapped[Decimal]
    af_instrumentalness : Mapped[Decimal]
    af_liveness : Mapped[Decimal]
    af_valence : Mapped[Decimal]
    af_tempo : Mapped[Decimal]
    af_time_signature : Mapped[Decimal]


def convert_to_mapped_objects(filename, data: list[dict[str, str]]) -> list[NewTable]:
    objects : list[NewTable] = []
    line_count = data.__len__()
    for idx, obj in enumerate(data):
        if (idx % 50 == 0):
            percentage = (idx / int(line_count))*100
            msg = f" Mapping '{filename}' - {percentage:2.0f}%"
            print(msg + " " * 100, end='\r')
        row : NewTable = NewTable()
        row.id = obj.get('id')
        row.title = obj.get('title')
        row.rank = obj.get('rank')
        row.date = obj.get('date')
        row.artist = obj.get('artist')
        row.url = obj.get('url')
        row.region = obj.get('region')
        row.chart = obj.get('chart')
        row.trend = obj.get('trend')
        row.streams = obj.get('streams')
        row.track_id = obj.get('track_id')
        row.album = obj.get('album')
        row.popularity = obj.get('popularity')
        row.duration_ms = obj.get('duration_ms')
        row.explicit = obj.get('explicit')
        row.release_date = obj.get('release_date')
        row.available_markets = obj.get('available_markets')
        row.af_danceability = obj.get('af_danceability')
        row.af_energy = obj.get('af_energy')
        row.af_key = obj.get('af_key')
        row.af_loudness = obj.get('af_loudness')
        row.af_mode = obj.get('af_mode')
        row.af_speechiness = obj.get('af_speechiness')
        row.af_acousticness = obj.get('af_acousticness')
        row.af_instrumentalness = obj.get('af_instrumentalness')
        row.af_liveness = obj.get('af_liveness')
        row.af_valence = obj.get('af_valence')
        row.af_tempo = obj.get('af_tempo')
        row.af_time_signature = obj.get('af_time_signature')
        objects.append(row)
    return objects
    
        

def main():
    files = unpack_zip()
    #convert(os.path.join(dirname, 'csv'), files)
    
    with engine.connect() as connection:
        connection.exec_driver_sql(sql_snippets.sql_create_db)
        connection.exec_driver_sql(sql_snippets.sql_create_base_table)
        connection.commit()
    
    session = SessionMaker()
    
    for file in files:
        data = get_data_from_csv(file)
        mapped = convert_to_mapped_objects(file, data)
        batch_count = int(100_000 / 100)
        line_count = data.__len__()
        batch_size = int(line_count / batch_count)
        remaining = int(line_count % batch_count)
        assert line_count == (batch_size * batch_count) + remaining
        
        for batch_idx in range(batch_count):
            batch_stride = batch_idx * batch_size

            percentage = (batch_stride / int(line_count))*100
            msg = f" Inserting from '{file}' - {percentage:2.0f}%"
            print(msg + " " * 100, end='\r')
            
            session.add_all(mapped[batch_stride:batch_stride+batch_count])
            session.commit()
        
        if (remaining != 0):
            session.add_all(mapped[batch_size+batch_count:])
            session.commit()
    
    session.close_all()

if __name__ == "__main__":
    main()
