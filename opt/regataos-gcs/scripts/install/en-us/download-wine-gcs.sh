#!/bin/bash
#

# Settings and variables
app_name="Compatibility mode"
app_download_link="https://github.com/regataos/wine-gcs/releases/download/wine-gcs-10.15/wine-gcs.tar.xz"
app_download_file_name="wine-gcs.tar.xz"
app_download_dir="/tmp/regataos-gcs"
app_download_status="Downloading..."
success_installation="Concluded!"
extracting_status="Extracting files..."
extraction_directory="/opt"
progressbar_dir="/tmp/progressbar-gcs"
installation_error="Error!"
installation_error_status="Download error."

# Search for processes
if test -e "$progressbar_dir/installing"; then
	exit 0
fi

# Prepare the progress bar
echo "installing" >$progressbar_dir/installing
echo $app_name >$progressbar_dir/app-name
echo "0%" >$progressbar_dir/progress
echo $app_download_status >$progressbar_dir/status
echo "" >$progressbar_dir/download-extra.txt
sleep 1
echo "show progress bar" >$progressbar_dir/progressbar

# Download
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

# Confirm download
if test -e "$app_download_dir/$app_download_file_name"; then
	echo "completed" >$progressbar_dir/progress-full
	echo "" >$progressbar_dir/status

	# Extract the DirectX files
	echo $extracting_status >$progressbar_dir/status
	echo "" >$progressbar_dir/progress
	echo "installing" >$progressbar_dir/progress-movement

	sudo /opt/regataos-gcs/scripts/extract-compat-mode "$app_download_dir/$app_download_file_name" "$extraction_directory/"
	rm -f $progressbar_dir/progress-movement
	echo "completed" >$progressbar_dir/progress-full
	echo "" >$progressbar_dir/status
	echo $success_installation >$progressbar_dir/progress

	sleep 3
	rm -f $progressbar_dir/*
	exit 0
else
	# Abort installations
	rm -f $progressbar_dir/download-percentage
	rm -f $app_download_dir/$app_download_file_name
	echo $installation_error >$progressbar_dir/progress
	echo $installation_error_status >$progressbar_dir/status
	sleep 5
	echo "abort installations" >$progressbar_dir/abort-installations
fi
