#!/bin/bash
sudo git pull -v >& git_log.txt
npm run start 2>&1| tee npm.txt
echo server running