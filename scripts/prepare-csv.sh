#! /usr/bin/bash

# command used to split the original ~30 GB csv file to ~200 MB blocks
split -l 100000 -d merged_data.csv file_

# command used to add the csv extension
for i in $(find file_*); do mv $i "$i.csv"; done

# command used to add the csv header to new blocks
for i in $(find . -type f -name "file_*.csv" -not -name "file_00.csv");                                                     
    do echo -e "$(head -1 file_00.csv)\n$(cat $i)" > $i;
done
