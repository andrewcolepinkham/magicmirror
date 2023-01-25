#!/bin/bash
while :
do
  currenttime=$(date +%H:%M)
   if [[ "$currenttime" > "23:00" ]] || [[ "$currenttime" < "07:30" ]]; then
     vcgencmd display_power 0
   else
     vcgencmd display_power 1
   fi
   echo $currenttime
   echo "Service is checking the time to determine display power"
   sleep 30
done
