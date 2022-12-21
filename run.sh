#!/bin/bash
for i in {1..5}
do
    echo "Checking for internet iteration: $i"
    wget -q --spider http://google.com
    if [ $? -eq 0 ]; then
        echo "Online" >> internet.txt
        break
    else
        echo "Offline" >> internet.txt
    fi
    sleep 10
done

sudo git pull -v >& git_log.txt
npm run start 2>&1| tee npm.txt
echo server running