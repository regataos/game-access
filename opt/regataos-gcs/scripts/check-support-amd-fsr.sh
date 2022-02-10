#!/bin/bash

# This script checks whether AMD FidelityFX Super Resolution​ (FSR)
# should be enabled or disabled by checking user settings or hardware.

# Check User Settings for AMD FSR
configuration_status=$(grep -r "amd-fsr=" $HOME/.config/regataos-gcs/regataos-gcs.conf)
if [ -z $configuration_status ]; then
	# AMD FSR settings have not yet been decided by the user, checking the
	# need to enable the feature based on the hardware of the machine.
	check_gpu=$(cat $HOME/.config/regataos-prime/system-info/dgpu-model.txt)
	if [[ $(echo "$check_gpu") == *"Radeon Vega"* ]]; then
		echo "GPU: $check_gpu | AMD FSR: on"
		echo "amd-fsr=true" >> "$HOME/.config/regataos-gcs/regataos-gcs.conf"
	else
		echo "$check_gpu"
		echo "GPU: $check_gpu | AMD FSR: off"
		echo "amd-fsr=false" >> "$HOME/.config/regataos-gcs/regataos-gcs.conf"
	fi
fi
