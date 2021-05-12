//English translation for the League Of Legends page
$(document).ready(function() {
	// Classification
	$("img.rating-icon").attr({src:"https://lolstatic-a.akamaihd.net/riotbar/prod/latest-experimental/images/footer/game-rating-logos/na-esrb.png"});
	$(".rating-img").css("margin-bottom", "25px");
	$(".rating-age").text("Fantasy Violence");
	$(".rating-age").css("font-weight", "400");
	$(".rating-status").text("Mild Suggestive Themes");
	$(".rating-text").text("Use of Alcohol and Tobacco");
	$(".rating-text2").text("Online Interactions Not Rated by the ESRB");

	// Discretion
	$(".discretion-title").text("Description");
	$(".discretion-text").html("League of Legends, also known only as LoL, is one of the few games that managed to accurately and successfully mix easy gameplay with an addictive formula, being a worldwide phenomenon, in addition to being a free game, which makes everything even more interesting.<br><br>LoL has an ever-expanding cast of champions. Each of them has a unique look and play style, which also includes skins, item builds and runes. Game modes include Summoner's Rift, most player's favorite battlefield, Twisted Treeline, the second Field of Justice that has two routes and teams of three champions, Dominion, a map for five control points spread across the arena, and Howling Abyss, which is inspired by the popular 'All Random All Mid' community game mode and which has two teams of five champions fighting for a single route.<br><br>In addition, the game also undergoes frequent changes, ranging from the launch of new game modes to balancing and adding new champions. This is great, as it keeps MOBA always dynamic and prevents the experience from becoming repetitive for players.");

	// System requirements
	$(".system-requirements").text("System requirements");
	//Minimum
	$(".system-minimum").text("MINIMUM");
	$(".system-processor-min").html("<b>Processor:</b> Dual Core 2 GHz or equivalent");
	$(".system-memory-min").html("<b>Memory:</b> 4 GB RAM");
	$(".graphicscard-min").html("<b>Video card:</b> graphics with 1 GB of VRAM");
	$(".storage-min").html("<b>Storage:</b> 15 GB of available disk space");
	//Maximum
	$(".system-recommended").text("RECOMMENDED");
	$(".system-processor-rec").html("<b>Processor:</b> Quad Core 2 GHz or equivalent");
	$(".system-memory-rec").html("<b>Memory:</b> 8 GB RAM");
	$(".graphicscard-rec").html("<b>Video card:</b> graphics with 2 GB of VRAM");
	$(".storage-rec").html("<b>Storage:</b> 20 GB of available disk space");
});
