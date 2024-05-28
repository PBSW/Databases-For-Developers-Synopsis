
docker exec -it mongodb /bin/bash
mongoimport --jsonArray  --collection spotify < /var/home/data/JSON_EXPORT.json