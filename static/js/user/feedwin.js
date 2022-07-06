if(feedObj) { 
    const url = new URL(location.href);
    feedObj.iuser = parseInt(url.searchParams.get('iuser'));
    feedObj.getFeedUrl = '/user/feed';
    feedObj.getFeedList();
}
// function getFeedList() {    
//     if(!feedObj) { return; }
//     feedObj.showLoading();            
//     const param = {
//         page: feedObj.currentPage++,        
//         iuser: url.searchParams.get('iuser')
//     }
//     fetch('/user/feed' + encodeQueryString(param))
//     .then(res => res.json())
//     .then(list => {                
//         feedObj.makeFeedList(list);                
//     })
//     .catch(e => {
//         console.error(e);
//         feedObj.hideLoading();
//     });
// }
// getFeedList();

(function() {
    const lData = document.querySelector('#lData');
    const btnFollow = document.querySelector('#btnFollow');
    const btnDelCurrentProfilePic = document.querySelector('#btnDelCurrentProfilePic');
    const follower = document.querySelector('.follower');
    follower.innerHTML = lData.dataset.follower;
    
    if(btnFollow) {
        btnFollow.addEventListener('click', function() {
            const param = {
                toiuser: parseInt(lData.dataset.toiuser)
            };

            console.log(param);//toiuser
            const follow = btnFollow.dataset.follow;
            console.log('follow : ' + follow);
            const followUrl = '/user/follow';
            switch(follow) {
                case '1': //팔로우 취소
                    fetch(followUrl + encodeQueryString(param), {method: 'DELETE'})
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                        if(res.result) {
                            btnFollow.dataset.follow = '0';
                            btnFollow.classList.remove('btn-outline-secondary');
                            btnFollow.classList.add("btn-primary");
                            if(btnFollow.dataset.youme === '1') {
                                btnFollow.innerText = "맞팔로우 하기";
                            } else {
                                btnFollow.innerText = "팔로우";
                            }
                            follower.innerHTML = parseInt(follower.innerHTML) - 1;
                        }
                    });
                    break;
                case '0': //팔로우 등록
                    fetch(followUrl, {method: 'POST', body: JSON.stringify(param)})
                    .then(res => res.json())
                    .then(res => {
                        if(res.result) {
                            btnFollow.dataset.follow = '1';
                            btnFollow.classList.remove("btn-primary");
                            btnFollow.classList.add('btn-outline-secondary');
                            btnFollow.innerText = "팔로우 취소";
                            console.log(follower.innerHTML);
                            follower.innerHTML = parseInt(follower.innerHTML) + 1;
                            console.log(res);
                        }
                    });
                    break;
            }
        });
    }

    if(btnDelCurrentProfilePic) {
        btnDelCurrentProfilePic.addEventListener('click', e => {
            
        })
    }

})();