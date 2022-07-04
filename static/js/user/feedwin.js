(function() {
    const gData = document.querySelector('#gData');

    const btnFollow = document.querySelector('#btnFollow');
    if(btnFollow) {
        btnFollow.addEventListener('click', function() {
            const param = {
                toiuser: parseInt(gData.dataset.toiuser)
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
                        }
                    });
                    break;
                case '0': //팔로우 등록
                    const toiuser = JSON.stringify(param);
                    fetch(followUrl + encodeQueryString(param), {method: 'POST', body: toiuser})
                    .then(res => res.json())
                    .then(res => {
                        btnFollow.dataset.follow = '1';
                        btnFollow.classList.remove("btn-primary");
                        btnFollow.classList.add('btn-outline-secondary');
                        btnFollow.innerText = "팔로우 취소";
                        console.log(res);
                    });
                    break;
            }
        });
    }

})();