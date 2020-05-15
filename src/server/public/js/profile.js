$(function(){
    $('.list-group-item').click(function() {
        console.log('list item clicked')
        if ($(this).hasClass('custom-active')) {
            $(this).removeClass('custom-active')
        }else{
            $(this).addClass('custom-active')
        }
    })

    $('.profile-edit-btn').click(function(){
        $('.profile-edit-bio').show(100);
        $('.update-img-option').show(100);
        $(this).hide();
    })

    $('.bio-save-btn').click(function(){
        $('.profile-edit-bio').hide(100);
    })

    $('.update-img-btn').click(function(){
        $('.update-img-option').hide(100);
    })

})