$(function(){
    $('.list-group-item').click(function() {
        if ($(this).hasClass('custom-active')) {
            $(this).removeClass('custom-active')
            let attValue = $(this).text(); 
            console.log(attValue);
            $.post('/attribute-update', {attribute: attValue})
                .done(()=>{
                    alert('Attribute changed')
                })
                .fail(()=>{
                    alert('Could not change attribute, please try again later')
                })
        }else{
            $(this).addClass('custom-active');
            let attValue = $(this).text(); 
            console.log(attValue);
            $.post('/attribute-update', {attribute: attValue})
                .done(()=>{
                    alert('Attribute changed')
                })
                .fail(()=>{
                    alert('Could not change attribute, please try again later')
                })
        }
    })

    $('.profile-edit-btn').click(function(){
        $('.profile-edit-bio').css('display', 'flex').hide().fadeIn();
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