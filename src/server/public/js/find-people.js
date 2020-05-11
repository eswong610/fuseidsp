$(function() {

        console.log('from find-people.js')

        //can access div where its active 
        const allcarousel = $('.carousel-item')
        $('.thumbsup').click(()=>{
            console.log('clicked')

            for (i of allcarousel) {
                
               if ($(i).hasClass('active')){
                   const usercaption = ($(i).children().children().text());
                   const likedusername = usercaption.split(',');
                   console.log(likedusername)

                   $.post('/liked_profile',
                        {liked_profile: likedusername[2] },
                        (data, status)=>{
                            console.log(req.user.username + 'liked ' + data + 'status: ' + status);
                        })
                

                   
               }
            }

        })
    
})