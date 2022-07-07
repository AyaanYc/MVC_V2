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
    const btnUpdCurrentProfilePic = document.querySelector('#btnUpdCurrentProfilePic');
    const btnProfileImgModalClose = document.querySelector('#btnProfileImgModalClose');
    // const profileImgMod = document.querySelector('#profileImgMod');
    const formProfile = document.querySelector('#profile');

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
            fetch('/user/profile', { method: 'DELETE' })
            .then(res => res.json())
            .then(res => {
                if(res.result) {
                    const profileImgList = document.querySelectorAll('.profileimg');
                    profileImgList.forEach(item => {
                        item.src = '/static/img/profile/defaultProfileimg.png';
                    });
                }
                btnProfileImgModalClose.click();
            });
        });
    }
    // console.log(profileImgMod.src);
    // if(profileImgMod.src === 'http://localhost/static/img/profile/defaultProfileimg.png'){
    //     profileImgMod.removeAttribute( 'data-bs-target' );
    //     profileImgMod.removeAttribute( 'data-bs-toggle' );
    //     profileImgMod.addEventListener('click', function(){
    //         formProfile.imgs.click();
    //     })
    // }프로필업로드 이미지없을시 파일업로드창뜨게
    if(btnUpdCurrentProfilePic) {
        btnUpdCurrentProfilePic.addEventListener('click', e => {
            formProfile.imgs.click();
        })
        
        const profileModal = document.querySelector('#newProfileModal');
        
        if(profileModal){
            formProfile.imgs.addEventListener('change', function(e) {
                const files = formProfile.imgs.files[0]//이미지파일
                const fData = new FormData();//creater element('form')
                fData.append('img', files)
                console.log(files);
                fetch('/user/profile', { 
                    method: 'POST',
                    body: fData
                })
                .then(res => res.json())
                .then(res => {
                    if(res.result){
                        console.log(res.result);
                        const reader = new FileReader();
                        reader.readAsDataURL(files);
                        reader.onload = function () {
                            const profileImgList = document.querySelectorAll('.profileimg');
                            profileImgList.forEach(profileImg => {
                            profileImg.src = reader.result;
                            });
                        };
                        btnProfileImgModalClose.click();
                    }
                });
            })
        }
    }

})();