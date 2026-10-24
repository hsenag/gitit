$if(usecache)$
<script type="text/javascript" src="$base$/js/jquery.hotkeys-0.2.2.min.js"></script>
<script type="text/javascript">
/* <![CDATA[ */
     \$(document).bind("keydown", "ctrl+r", function() {
         \$.post("$base$/_expire$pageUrl$");
         return true;
         });
/* ]]> */
</script>
$endif$
