#!/bin/bash 
#

# DirectX Download

# Settings and variables
app_name="Baixando o DirectX"
app_nickname="directx"
app_name_process="Baixar o DirectX"
app_download_status="Espere um momento, baixando o DirectX."
app_download_link="https://files.holarse-linuxgaming.de/mirrors/microsoft/directx_Jun2010_redist.exe"
app_download_file_name="directx_Jun2010_redist.exe"
app_download_dir="$HOME/.cache/winetricks/directx9"
success_installation="Concluído"
extracting_status="Extraindo arquivos..."
installation_error="Erro"
installation_error_status="Erro no download"
progressbar_dir="/tmp/progressbar-gcs"

# Search for processes
if test -e "$progressbar_dir/installing" ; then
	# Put the process in the installation queue
	echo "$app_nickname=install process-$app_name_process" >> $progressbar_dir/queued-process

	#I'm in the process queue, see you later
	exit 0

else
	echo "Starting the installation..."
fi

# Prepare the progress bar
echo "installing" > $progressbar_dir/installing
echo $app_name > $progressbar_dir/app-name
echo "0%" > $progressbar_dir/progress
echo $app_download_status > $progressbar_dir/status
echo "" > $progressbar_dir/download-extra.txt
sleep 1
echo "show progress bar" > $progressbar_dir/progressbar

# Download
rm -f $progressbar_dir/down-cancel
mkdir -p $app_download_dir/
echo "$app_download_dir/$app_download_file_name" > $progressbar_dir/file-download-size
echo "wget --no-check-certificate -O $app_download_dir/$app_download_file_name $app_download_link" > $progressbar_dir/get-pid
wget --no-check-certificate -O $app_download_dir/$app_download_file_name $app_download_link 2>&1 | (pv -n > $progressbar_dir/download-percentage)
echo 100% > $progressbar_dir/progress
sleep 3
rm -f $progressbar_dir/download-percentage
rm -f $progressbar_dir/download-download-size
rm -f $progressbar_dir/download-speed
rm -f $progressbar_dir/file-size
rm -f $progressbar_dir/eta

# Confirm download
if test -e "$app_download_dir/$app_download_file_name" ; then
	echo "completed" > $progressbar_dir/progress-full
	echo "" > $progressbar_dir/status
	echo $success_installation > $progressbar_dir/progress

	# Extract the DirectX files
	echo $extracting_status > $progressbar_dir/status
	echo "" > $progressbar_dir/progress
	echo "installing" > $progressbar_dir/progress-movement

	# Download .NET Framework 4.0
	if test -e /tmp/regataos-gcs/dotnet ; then
		rm -f /tmp/regataos-gcs/dotnet
		#/opt/regataos-gcs/scripts/install/scripts-install/dotnet40-compatibility-mode.sh start
	fi

	rm -f $progressbar_dir/progress-movement
	rm -f $progressbar_dir/progress-full
	rm -f $progressbar_dir/installing

	exit 0

else
	# Abort installations
	rm -f $progressbar_dir/download-percentage
	rm -f $app_download_dir/$app_download_file_name
	echo $installation_error > $progressbar_dir/progress
	echo $installation_error_status > $progressbar_dir/status
	sleep 5
	echo "abort installations" > $progressbar_dir/abort-installations
fi
