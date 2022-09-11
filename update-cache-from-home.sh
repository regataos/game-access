#!/bin/bash

# If necessary, update cache of home images
if test ! -e "$HOME/.config/regataos-gcs/cache/img"; then
	mkdir -p "$HOME/.config/regataos-gcs/cache/img/"
fi

# Home slide images
function downloadSlideImages() {
	#Image from slide 1
	function slideImage1() {
		slide1_image_name="slide2-lol.jpg"
		slide1_image_code="0GNCSg2"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$slide1_image_name"; then
			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$slide1_image_name" \
				"https://i.ibb.co/$slide1_image_code/$slide1_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide1_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img1.jpg"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide1_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img1.jpg"
		fi
	}

	#Image from slide 2
	function slideImage2() {
		slide2_image_name="slide-overwatch.jpg"
		slide2_image_code="7NDK1cL"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$slide2_image_name"; then
			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$slide2_image_name" \
				"https://i.ibb.co/$slide2_image_code/$slide2_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide2_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img2.jpg"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide2_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img2.jpg"
		fi
	}

	#Image from slide 3
	function slideImage3() {
		slide3_image_name="slide-bfv.jpg"
		slide3_image_code="cgwKmzK"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$slide3_image_name"; then
			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$slide3_image_name" \
				"https://i.ibb.co/$slide3_image_code/$slide3_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide3_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img3.jpg"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide3_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img3.jpg"
		fi
	}

	#Image from slide 4
	function slideImage4() {
		slide4_image_name="slide-control.jpg"
		slide4_image_code="J3y8RPC"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$slide4_image_name"; then
			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$slide4_image_name" \
				"https://i.ibb.co/$slide4_image_code/$slide4_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide4_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img4.jpg"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$slide4_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/slide-img4.jpg"
		fi
	}

	slideImage1 &
	slideImage2 &
	slideImage3 &
	slideImage4
}

# Home block images
function downloadBlockImages() {
	#Image 1
	function blockImage1() {
		block1_image_name="block1-hd.webp"
		block1_image_code="wgTBLj1"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$block1_image_name"; then
			# Clear cache
			rm -f $HOME/.config/regataos-gcs/cache/img/block1-*.jpg
			rm -f $HOME/.config/regataos-gcs/cache/img/block1-*.webp

			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$block1_image_name" \
				"https://i.ibb.co/$block1_image_code/$block1_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$block1_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/block-img1.webp"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$block1_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/block-img1.webp"
		fi
	}

	#Image 2
	function blockImage2() {
		block2_image_name="block2-xonotic.jpg"
		block2_image_code="HpgTX1Y"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$block2_image_name"; then
			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$block2_image_name" \
				"https://i.ibb.co/$block2_image_code/$block2_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$block2_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/block-img2.jpg"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$block2_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/block-img2.jpg"
		fi
	}

	#Image 3
	function blockImage3() {
		block3_image_name="block3-warframe.jpg"
		block3_image_code="VqkY2wR"

		if test ! -e "$HOME/.config/regataos-gcs/cache/img/$block3_image_name"; then
			wget --no-check-certificate -O "$HOME/.config/regataos-gcs/cache/img/$block3_image_name" \
				"https://i.ibb.co/$block3_image_code/$block3_image_name"

			ln -sf "$HOME/.config/regataos-gcs/cache/img/$block3_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/block-img3.jpg"

		else
			ln -sf "$HOME/.config/regataos-gcs/cache/img/$block3_image_name" \
				"$HOME/.config/regataos-gcs/cache/img/block-img3.jpg"
		fi
	}

	blockImage1 &
	blockImage2 &
	blockImage3
}

downloadSlideImages
downloadBlockImages
