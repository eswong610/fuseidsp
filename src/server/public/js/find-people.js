$(function() {

        //can access div where its active 
        const allcarousel = $('.carousel-item')
        $('.thumbsup').click(()=>{

            for (i of allcarousel) {
                
               if ($(i).hasClass('active')){
                   console.log(i)
                   
               }
            }

        })
    

    
})