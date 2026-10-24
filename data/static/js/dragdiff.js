$(document).ready(function(){
    $("#content").prepend("<p>Drag one revision onto another to see differences.</p>");
    $(".difflink").draggable({helper: "clone"}); 
    $(".difflink").droppable({
         accept: ".difflink",
         drop: function(ev, ui) {
            var targetOrder = parseInt($(this).attr("data-order"));
            var sourceOrder = parseInt($(ui.draggable).attr("data-order"));
            var diffurl = $(this).attr("data-diffurl");
            if (targetOrder < sourceOrder) {
                var fromRev = $(this).attr("data-revision");
                var toRev   = $(ui.draggable).attr("data-revision");
            } else {
                var toRev   = $(this).attr("data-revision");
                var fromRev = $(ui.draggable).attr("data-revision");
            };
            location.href = diffurl + '?from=' + fromRev + '&to=' + toRev;
            }
        });
});

