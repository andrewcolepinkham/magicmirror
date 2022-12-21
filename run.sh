#!/bin/bash
wget -q --spider http://google.com

if [ $? -eq 0 ]; then
    echo "Online" >> git_log.txt
else
    echo "Offline" >> git_log.txt
fi
sudo git pull -v >& git_log.txt
npm run start 2>&1| tee npm.txt
echo server running