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
block1_image_name="block-gc3.jpg"
block1_image_code="cgT2dC4"
if test ! -e "$image_download_cache_dir/$block1_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$block1_image_name" \
	"https://i.ibb.co/$block1_image_code/$block1_image_name"

	ln -sf "$image_download_cache_dir/$block1_image_name" "$image_download_cache_dir/block-img1.jpg"
fi

#Image 2
block2_image_name="block-pa2.jpg"
block2_image_code="RBWBTgm"
if test ! -e "$image_download_cache_dir/$block2_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$block2_image_name" \
	"https://i.ibb.co/$block2_image_code/$block2_image_name"

	ln -sf "$image_download_cache_dir/$block2_image_name" "$image_download_cache_dir/block-img2.jpg"
fi

#Image 3
block3_image_name="block-rocket-league.jpg"
block3_image_code="XpXFCbj"
if test ! -e "$image_download_cache_dir/$block3_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$block3_image_name" \
	"https://i.ibb.co/$block3_image_code/$block3_image_name"

	ln -sf "$image_download_cache_dir/$block3_image_name" "$image_download_cache_dir/block-img3.jpg"
fi
