$(document).ready(function(){
    
    /* tabs */
	$('.tabs a').click(function(){
		$(this).parent('li').siblings().removeClass('cur');
		$(this).parent('li').addClass('cur');
		var $targetname = $(this).attr('href').substring(1);
		$(this).parents('.tabs').siblings('.tabs-main').hide();
		$('.tabs-'+$targetname).show();
	});
    
    
});