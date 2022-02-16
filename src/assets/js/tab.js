$(document).ready(function(){
    
    /* tabs */
	$('.tabs a').click(function(){
		$(this).parent('li').siblings().removeClass('head-center-active');
		$(this).parent('li').addClass('head-center-active');
		var $targetname = $(this).attr('href').substring(1);
		$(this).parents('.tabs').siblings('.tabs-main').hide();
		$('.tabs-'+$targetname).show();
	});
    
    
});