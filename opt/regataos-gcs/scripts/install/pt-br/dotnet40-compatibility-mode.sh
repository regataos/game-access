#!/bin/bash
#

# Microsoft .NET Framework Download

# Settings and variables
app_name="Baixando o .NET Framework 4.0"
app_nickname="dotnet40"
app_name_process="Baixar o Microsoft .NET Framework 4.0"
app_download_status="Baixando o Microsoft .NET Framework 4.0."
app_download_link="https://download.microsoft.com/download/9/5/A/95A9616B-7A37-4AF6-BC36-D6EA96C8DAAE/dotNetFx40_Full_x86_x64.exe"
app_download_file_name="dotNetFx40_Full_x86_x64.exe"
app_download_dir="$HOME/.cache/winetricks/dotnet40"
progressbar_dir="/tmp/progressbar-gcs"
success_installation="Concluído!"
installation_error="Erro!"
installation_error_status="Erro no download"

# Prepare the progress bar
echo "installing" >$progressbar_dir/installing
echo $app_name >$progressbar_dir/app-name
echo "0%" >$progressbar_dir/progress
echo $app_download_status >$progressbar_dir/status
echo "" >$progressbar_dir/download-extra.txt
sleep 1
echo "show progress bar" >$progressbar_dir/progressbar

# Download
if test ! -e "$app_download_dir/$app_download_file_name"; then
	rm -f $progressbar_dir/down-cancel
	mkdir -p $app_download_dir/
	echo "$app_download_dir/$app_download_file_name" >$progressbar_dir/file-download-size
	echo "wget --no-check-certificate -O $app_download_dir/$app_download_file_name $app_download_link" >$progressbar_dir/get-pid
	wget --no-check-certificate -O $app_download_dir/$app_download_file_name $app_download_link 2>&1 | (pv -n >$progressbar_dir/download-percentage)
	echo 100% >$progressbar_dir/progress
	sleep 3
	rm -f $progressbar_dir/download-percentage
	rm -f $progressbar_dir/download-download-size
	rm -f $progressbar_dir/download-speed
	rm -f $progressbar_dir/file-size
	rm -f $progressbar_dir/eta
fi

# Confirm download
if test -e "$app_download_dir/$app_download_file_name"; then
	echo "completed" >$progressbar_dir/progress-full
	echo "" >$progressbar_dir/status
	echo $success_installation >$progressbar_dir/progress
	sleep 2
	rm -f $progressbar_dir/progress-full
	rm -f $progressbar_dir/installing

	# Download .NET Framework 4.8
	#/opt/regataos-gcs/scripts/install/scripts-install/dotnet48-compatibility-mode.sh start

else
	# Abort installations
	rm -f $progressbar_dir/download-percentage
	rm -f $app_download_dir/$app_download_file_name
	echo $installation_error >$progressbar_dir/progress
	echo $installation_error_status >$progressbar_dir/status
	sleep 5
	echo "abort installations" >$progressbar_dir/abort-installations
fi
