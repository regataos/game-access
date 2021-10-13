#!/bin/bash

# If necessary, update cache of home images
image_download_cache_dir="$HOME/.config/regataos-gcs/cache/img"

if test ! -e "$image_download_cache_dir"; then
	mkdir -p "$image_download_cache_dir/"
fi

# Home slide images
#Image from slide 1
if test ! -e "$image_download_cache_dir/slide-gtav.jpg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/slide-gtav.jpg" \
	"https://i.ibb.co/fSsSMSD/slide-gtav.jpg"

	ln -sf "$image_download_cache_dir/slide-gtav.jpg" "$image_download_cache_dir/slide-img1.jpg"
fi

#Image from slide 2
if test ! -e "$image_download_cache_dir/slide-overwatch.jpg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/slide-overwatch.jpg" \
	"https://i.ibb.co/7NDK1cL/slide-overwatch.jpg"

	ln -sf "$image_download_cache_dir/slide-overwatch.jpg" "$image_download_cache_dir/slide-img2.jpg"
fi

#Image from slide 3
if test ! -e "$image_download_cache_dir/slide-bfv.jpg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/slide-bfv.jpg" \
	"https://i.ibb.co/cgwKmzK/slide-bfv.jpg"

	ln -sf "$image_download_cache_dir/slide-bfv.jpg" "$image_download_cache_dir/slide-img3.jpg"
fi

#Image from slide 4
if test ! -e "$image_download_cache_dir/slide-anthem.jpg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/slide-anthem.jpg" \
	"https://i.ibb.co/XSrB4Cs/slide-anthem.jpg"

	ln -sf "$image_download_cache_dir/slide-anthem.jpg" "$image_download_cache_dir/slide-img4.jpg"
fi

# Home block images
#Image 1
if test ! -e "$image_download_cache_dir/block-pc-bs.jpeg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/block-pc-bs.jpeg" \
	"https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_PCBuildingSimulator_TheIrregularCorporation_S1_2560x1440-48cc12f45bf3eaaaae79cba6594b06d8?h=480&resize=1&w=854"

	ln -sf "$image_download_cache_dir/block-pc-bs.jpeg" "$image_download_cache_dir/block-img1.jpeg"
fi

#Image 2
if test ! -e "$image_download_cache_dir/block-path-of-exile.jpg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/block-path-of-exile.jpg" \
	"https://i.ibb.co/MhM2YBp/block-path-of-exile.jpg"

	ln -sf "$image_download_cache_dir/block-path-of-exile.jpg" "$image_download_cache_dir/block-img2.jpg"
fi

#Image 3
if test ! -e "$image_download_cache_dir/block-rocket-league.jpg"; then
	wget --no-check-certificate -O "$image_download_cache_dir/block-rocket-league.jpg" \
	"https://i.ibb.co/XpXFCbj/block-rocket-league.jpg"

	ln -sf "$image_download_cache_dir/block-rocket-league.jpg" "$image_download_cache_dir/block-img3.jpg"
fi
