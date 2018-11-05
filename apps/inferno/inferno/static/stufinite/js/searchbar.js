$("#search-form").bind("focus", function() {
    $(".stufinite-app-searchbar-toggle").attr("data-toggle", "true")
    $(".stufinite-app-searchbar-container").animate({
        right: 0
    }, 200);
});

$(".stufinite-app-searchbar-toggle").bind("click", function(e) {
    if ($(".stufinite-app-searchbar-toggle").attr("data-toggle") !== "true") {
        $(".stufinite-app-searchbar-toggle").attr("data-toggle", "true")
        $(".stufinite-app-searchbar-container").animate({
            right: 0
        }, 200);
    } else {
        $(".stufinite-app-searchbar-toggle").attr("data-toggle", "false")
        $(".stufinite-app-searchbar-container").animate({
            right: "-300px"
        }, 200);
    }
});
