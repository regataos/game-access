#!/bin/bash

# This script checks whether AMD FidelityFX Super Resolution​ (FSR)
# should be enabled or disabled by checking user settings or hardware.

# AMD FSR settings have not yet been decided by the user, checking the
# need to enable the feature based on the hardware of the machine.
function check_hardware() {
	vulkan_test=$(vulkaninfo)
	if [[ $vulkan_test == *"Instance Extensions"* ]]; then
		if [[ $vulkan_test != *"Vulkan support is incomplete"* ]]; then
			if test ! -e "/tmp/regataos-prime/use-hybrid-graphics.txt"; then
				if [[ $(inxi -G | egrep -i "Card-1|Device-1" | cut -d":" -f 3- | cut -d"[" -f 2- | cut -d"]" -f -1) == *"Radeon Vega"* ]]; then
					vulkan_support="vulkan_supported"
				fi
			fi
		fi
	fi
}

# Check User Settings for AMD FSR
configuration_status=$(grep -r "amd-fsr=" $HOME/.config/regataos-gcs/regataos-gcs.conf)
if [ -z $configuration_status ]; then
	check_hardware

	if [[ $(echo $vulkan_support) == *"vulkan_supported"* ]]; then
		echo "amd-fsr=true" >> "$HOME/.config/regataos-gcs/regataos-gcs.conf"
	else
		echo "amd-fsr=false" >> "$HOME/.config/regataos-gcs/regataos-gcs.conf"
	fi
fi
