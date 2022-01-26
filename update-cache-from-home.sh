#!/bin/bash

# If necessary, update cache of home images
image_download_cache_dir="$HOME/.config/regataos-gcs/cache/img"

if test ! -e "$image_download_cache_dir"; then
	mkdir -p "$image_download_cache_dir/"
fi

# Home slide images
#Image from slide 1
slide1_image_name="slide-gtav.jpg"
slide1_image_code="fSsSMSD"
if test ! -e "$image_download_cache_dir/$slide1_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$slide1_image_name" \
	"https://i.ibb.co/$slide1_image_code/$slide1_image_name"

	ln -sf "$image_download_cache_dir/$slide1_image_name" "$image_download_cache_dir/slide-img1.jpg"
fi

#Image from slide 2
slide2_image_name="slide-overwatch.jpg"
slide2_image_code="7NDK1cL"
if test ! -e "$image_download_cache_dir/$slide2_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$slide2_image_name" \
	"https://i.ibb.co/$slide2_image_code/$slide2_image_name"

	ln -sf "$image_download_cache_dir/$slide2_image_name" "$image_download_cache_dir/slide-img1.jpg"
fi

#Image from slide 3
slide3_image_name="slide-bfv.jpg"
slide3_image_code="cgwKmzK"
if test ! -e "$image_download_cache_dir/$slide3_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$slide3_image_name" \
	"https://i.ibb.co/$slide3_image_code/$slide3_image_name"

	ln -sf "$image_download_cache_dir/$slide3_image_name" "$image_download_cache_dir/slide-img1.jpg"
fi

#Image from slide 4
slide4_image_name="slide-control.jpg"
slide4_image_code="BCbWHJF"
if test ! -e "$image_download_cache_dir/$slide4_image_name"; then
	wget --no-check-certificate -O "$image_download_cache_dir/$slide4_image_name" \
	"https://i.ibb.co/$slide4_image_code/$slide4_image_name"

	ln -sf "$image_download_cache_dir/$slide4_image_name" "$image_download_cache_dir/slide-img1.jpg"
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
block2_image_name="block-pfe.jpg"
block2_image_code="M6hq1rS"
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
