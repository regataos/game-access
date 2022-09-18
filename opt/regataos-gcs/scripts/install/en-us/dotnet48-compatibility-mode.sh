#!/bin/bash
#

# Microsoft .NET Framework Download

# Settings and variables
app_name="Downloading .NET Framework 4.8"
app_nickname="dotnet48"
app_name_process="Download Microsoft .NET Framework 4.8"
app_download_status="Downloading Microsoft .NET Framework 4.8."
app_download_link="https://download.visualstudio.microsoft.com/download/pr/7afca223-55d2-470a-8edc-6a1739ae3252/abd170b4b0ec15ad0222a809b761a036/ndp48-x86-x64-allos-enu.exe"
app_download_file_name="ndp48-x86-x64-allos-enu.exe"
app_download_dir="$HOME/.cache/winetricks/dotnet48"
success_installation="Concluded!"
installation_error="Error!"
installation_error_status="Download error"
progressbar_dir="/tmp/progressbar-gcs"

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

	# If there are no more processes, clear the progress bar cache
	if test ! -e "$progressbar_dir/queued-1"; then
		rm -f $progressbar_dir/progressbar
		rm -f $progressbar_dir/*
	fi
else
	# Abort installations
	rm -f $progressbar_dir/download-percentage
	rm -f $app_download_dir/$app_download_file_name
	rm -f $progressbar_dir/installing
	echo $installation_error >$progressbar_dir/progress
	echo $installation_error_status >$progressbar_dir/status
	sleep 5
	echo "abort installations" >$progressbar_dir/abort-installations
fi
