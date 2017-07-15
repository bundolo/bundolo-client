#!/bin/bash
cd /home/bup/projects/bundolo/git/bundolo-client/
/home/bup/programs/gradle-4.0/bin/gradle
cp -r build/. /home/bup/projects/bundolo/client
echo "bundolo client compiled at: $(date)" >> /var/log/bundolo/bundolo_incron_log.txt

