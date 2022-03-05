#!/bin/bash
DOWNLOAD() {
  rand="$RANDOM `date`"
  pipe="/tmp/pipe.`echo '$rand' | md5sum | tr -d ' -'`"
  mkfifo $pipe
  wget "$1" --no-check-certificate 2>&1 | while read data;do
    if [ "`echo $data | grep '^Length:'`" ]; then
      total_size=`echo $data | grep "^Length:" | sed 's/.*\((.*)\).*/\1/' |  tr -d '()'`
    fi
    if [ "`echo $data | grep '[0-9]*%' `" ];then
      percent=`echo $data | grep -o "[0-9]*%" | tr -d '%'`
      current=`echo $data | grep "[0-9]*%" | sed 's/\([0-9BKMG.]\+\).*/\1/' `
      speed=`echo $data | grep "[0-9]*%" | sed 's/.*\(% [0-9BKMG.]\+\).*/\1/' | tr -d ' %'`
      remain=`echo $data | grep -o "[0-9A-Za-z]*$" `
      echo $percent
      echo "#$appName...\n$(echo $current | awk '{$1=$1/1024; print $1;}' | cut -d'.' -f1)MB $total $(echo $total_size | sed 's/M/MB/') ($percent%)\n\n$estimatedTime: $remain"
    fi
  done > $pipe &
 
  wget_info=`ps ax |grep "wget.*$1" |awk '{print $1"|"$2}'`
  wget_pid=`echo $wget_info|cut -d'|' -f1 `
 
  env GTK_THEME=Adwaita:dark zenity --progress --auto-close --auto-kill --no-cancel --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
  --text="Connecting to $1\n\n\n" --width="350" --title="Regata OS Game Access"< $pipe
  if [ "`ps -A |grep "$wget_pid"`" ];then
    kill $wget_pid
  fi
  rm -f $pipe
}
 
if [ $1 ];then
  DOWNLOAD "$1"
else
  dllink=$(zenity --entry --text "Your download link :" --width="350" --entry-text "" --title="Download url")
  if [ $dllink ];then
    DOWNLOAD "$dllink"
  fi
fi
