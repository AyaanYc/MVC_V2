const feedObj = {
    limit: 20,
    itemLength: 0,
    currentPage: 1,
    swiper: null,
    refreshSwipe: function() {
        if(this.swiper !== null) { this.swiper = null; }
        this.swiper = new Swiper('.swiper', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: { el: '.swiper-pagination' },
            allowTouchMove: false,
            direction: 'horizontal',
            loop: false
        });
    },
    loadingElem: document.querySelector('.loading'),
    containerElem: document.querySelector('#item_container'),
    getFeedCmtList: function(ifeed, divCmtList, spanMoreCmt) {
        fetch(`/feedCmt/index?ifeed=${ifeed}`)
        .then(res => res.json())
        .then(res => {
            if(res && res.length > 0) {
                if(spanMoreCmt) { spanMoreCmt.remove(); }
                divCmtList.innerHTML = null;
                res.forEach(item => {
                    const divCmtItem = this.makeCmtItem(item);
                    divCmtList.appendChild(divCmtItem);
                })
            }
        });
    },
    makeCmtItem: function(item) {
        const divCmtItemContainer = document.createElement('div');
        divCmtItemContainer.className = 'd-flex flex-row align-items-center mb-2';
        const src = '/static/img/profile/' + (item.writerimg ? `${item.iuser}/${item.writerimg}` : 'defaultProfileImg_100.png');
        divCmtItemContainer.innerHTML = `
            <div class="circleimg h24 w24 me-1">
                <img src="${src}" class="profile w24 pointer" onclick="moveToFeedWin(${item.iuser})">               
            </div>
            <div class="d-flex flex-row">
                <div class="me-2">${item.writer} - <span class="rem0_8">${getDateTimeInfo(item.regdt)}</span></div>
                <div>${item.cmt}</div>
            </div>
        `;
        return divCmtItemContainer;
    }, 
    makeFeedList: function(list) {//item을 받아서 리스트(div)에 추가
        if(list.length !== 0) {
            list.forEach(item => {
                const divItem = this.makeFeedItem(item);
                this.containerElem.appendChild(divItem);
            });
        }
        this.refreshSwipe();
        this.hideLoading();
    },
    makeFeedItem: function(item) {//item을 만들어서 return
        // console.log(item);
        //리스트부모
        const divContainer = document.createElement('div');
        divContainer.className = 'item mt-3 mb-3';
        
        //리스트헤더
        const divTop = document.createElement('div');
        divContainer.appendChild(divTop);

        const regDtInfo = getDateTimeInfo(item.regdt);
        divTop.className = 'd-flex flex-row ps-3 pe-3';
        const writerImg = `<img src='/static/img/profile/${item.iuser}/${item.mainimg}' 
            onerror='this.error=null;this.src="/static/img/profile/defaultProfileimg.png"'>`;

        divTop.innerHTML = `
            <div class="d-flex flex-column justify-content-center">
                <div class="circleimg h40 w40 pointer feedwin">${writerImg}</div>
            </div>
            <div class="p-3 flex-grow-1">
                <div><span class="pointer feedwin">${item.writer}</span> - ${regDtInfo}</div>
                <div>${item.location === null ? '' : item.location}</div>
            </div>
        `;

        const feedwinList = divTop.querySelectorAll('.feedwin');
        feedwinList.forEach(el => {
            el.addEventListener('click', () => {
                moveToFeedWin(item.iuser);
            });
        });

        // 이미지리스트
        const divImgSwiper = document.createElement('div');
        divContainer.appendChild(divImgSwiper);
        divImgSwiper.className = 'swiper item_img';
        divImgSwiper.innerHTML = `
            <div class="swiper-wrapper align-items-center"></div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        `;
        const divSwiperWrapper = divImgSwiper.querySelector('.swiper-wrapper');
                    
        item.imgList.forEach(function(imgObj) {
            const divSwiperSlide = document.createElement('div');
            divSwiperWrapper.appendChild(divSwiperSlide);
            divSwiperSlide.classList.add('swiper-slide');

            const img = document.createElement('img');
            divSwiperSlide.appendChild(img);
            img.className = 'w100p_mw614';
            img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;
            img.addEventListener('click', function() {
                const imgbox = document.createElement('div');
                imgbox.className = "modal-img pointer d-flex justify-content-center align-items-center";
                imgbox.innerHTML = `
                    <div class="modal-dialog">
                        <img class="w500" src=${img.src}>
                    </div>`
                    imgbox.addEventListener("click",()=>{
                        imgbox.remove();
                    })
                const main = document.querySelector('main');
                main.appendChild(imgbox);
            })
        });

        //좋아요아이콘, dm 담을 상자
        const divBtns = document.createElement('div');
        divContainer.appendChild(divBtns);
        divBtns.className = 'favCont p-3 d-flex flex-row';

        //좋아요 아이콘
        const heartIcon = document.createElement('i');
        divBtns.appendChild(heartIcon);
        heartIcon.className = 'fa-heart pointer rem1_5 me-3';
        heartIcon.classList.add(item.isFav === 1 ? 'fas' : 'far');//item은 rest에있는 각 객체
        heartIcon.addEventListener('click', e => {
            
            let method = 'POST';
            if(item.isFav === 1) { //delete (1은 0으로 바꿔줘야 함)
                method = 'DELETE';
            }

            fetch(`/feed/fav/${item.ifeed}`, {
                'method': method,
            }).then(res => res.json())
            .then(res => {                    
                if(res.result) {
                    item.isFav = 1 - item.isFav; // 0 > 1, 1 > 0
                    if(item.isFav === 0) { // 좋아요 취소
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                    } else { // 좋아요 처리
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                    }
                } else {
                    alert('좋아요를 할 수 없습니다.');
                }
            })
            .catch(e => {
                alert('네트워크에 이상이 있습니다.');
            });
        });


        //dm
        const divDm = document.createElement('div');
        divBtns.appendChild(divDm);
        divDm.className = 'pointer';
        divDm.innerHTML = `<svg aria-label="다이렉트 메시지" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>`;

        //좋아요 갯수
        const divFav = document.createElement('div');
        divContainer.appendChild(divFav);
        divFav.className = 'p-3 d-none';
        const spanFavCnt = document.createElement('span');
        divFav.appendChild(spanFavCnt);
        spanFavCnt.className = 'bold';
        spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;

        if(item.favCnt > 0) { divFav.classList.remove('d-none'); }

        //내용
        if(item.ctnt !== null && item.ctnt !== '') {
            const divCtnt = document.createElement('div');
            divContainer.appendChild(divCtnt);
            divCtnt.innerText = item.ctnt;
            divCtnt.className = 'itemCtnt p-3';
        }

        //보이는 댓글 부모div
        const divCmtList = document.createElement('div');
        divContainer.appendChild(divCmtList);      
        divCmtList.className = 'ms-3';
        //댓글더보기 댓글등록창부모
        const divCmt = document.createElement('div');
        divContainer.appendChild(divCmt);   
        const spanMoreCmt = document.createElement('span');//댓글더보기

        if(item.cmt) {
            const divCmtItem = this.makeCmtItem(item.cmt);//보이는 댓글내용(사진,시간,내용)
            divCmtList.appendChild(divCmtItem);

            if(item.cmt.ismore === 1) {//댓글이 2개이상이면
                const divMoreCmt = document.createElement('div');//댓글더보기 div
                divCmt.appendChild(divMoreCmt);
                divMoreCmt.className = 'ms-3 mb-3';

                divMoreCmt.appendChild(spanMoreCmt);
                spanMoreCmt.className = 'pointer rem0_9 c_lightgray';
                spanMoreCmt.innerText = '댓글 더보기..';
                spanMoreCmt.addEventListener('click', e => {
                    this.getFeedCmtList(item.ifeed, divCmtList, spanMoreCmt);//댓글리스트 가져오기
                });
            }
        }
        //댓글등록창 부모div
        const divCmtForm = document.createElement('div');
        divCmtForm.className = 'd-flex flex-row';     
        divCmt.appendChild(divCmtForm);
        //댓글등록창
        divCmtForm.innerHTML = `
            <input type="text" class="flex-grow-1 my_input back_color p-2" placeholder="댓글을 입력하세요...">
            <button type="button" class="btn btn-outline-primary">등록</button>
        `;
        //적을댓글 내용과 버튼선택
        const inputCmt = divCmtForm.querySelector('input');
        inputCmt.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') {
                btnCmtReg.click();
            }
        });
        const btnCmtReg = divCmtForm.querySelector('button');
        //댓글등록버튼을 누르면 
        btnCmtReg.addEventListener('click', e => {
            const param = {
                ifeed: item.ifeed,
                cmt: inputCmt.value
            }
            fetch(`/feedCmt/index`, {//포스트방식으로 백엔드에 json형식으로 변환하여 전송
                method: 'POST',
                body: JSON.stringify(param)
            })
            .then(res => res.json())
            .then(res => {      
                console.log(res);              
                if(res.result) {
                    inputCmt.value = '';
                    //댓글 공간에 댓글 내용 추가
                    this.getFeedCmtList(param.ifeed, divCmtList, spanMoreCmt);
                }
            });
        })


        return divContainer;
    },

    showLoading: function() { this.loadingElem.classList.remove('d-none'); },
    hideLoading: function() { this.loadingElem.classList.add('d-none'); }

}


function moveToFeedWin(iuser) {
    location.href = `/user/feedwin?iuser=${iuser}`;
}


(function() { //피드등록
    const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
    if(btnNewFeedModal) {
        const modal = document.querySelector('#newFeedModal');
        const body =  modal.querySelector('#id-modal-body');
        const frmElem = modal.querySelector('form');
        const btnClose = modal.querySelector('.btn-close');
        //이미지 값이 변하면
        frmElem.imgs.addEventListener('change', function(e) { //input name=imgs접근 type=file
            console.log(`length: ${e.target.files.length}`);
            if(e.target.files.length > 0) { //선택한 파일 갯수 e.target=input(name=imgs)
                body.innerHTML = `
                    <div>
                        <div class="d-flex flex-md-row">
                            <div class="flex-grow-1 h-full"><img id="id-img" class="w300"></div>
                            <div class="ms-1 w250 d-flex flex-column">                
                                <textarea placeholder="문구 입력..." class="flex-grow-1 p-1"></textarea>
                                <input type="text" placeholder="위치" class="mt-1 p-1">
                            </div>
                        </div>
                    </div>
                    <div class="mt-2">
                        <button type="button" class="btn btn-primary">공유하기</button>
                    </div>
                `;
                const imgElem = body.querySelector('#id-img');

                const imgSource = e.target.files[0];//선택한사진
                const reader = new FileReader();
                reader.readAsDataURL(imgSource);//내컴퓨터에있는 이미지의 위치값
                reader.onload = function() {//이미지가 로딩이됫다면 함수실행()
                    imgElem.src = reader.result;//img태그.src에 이미지를 넣는다.
                };

                const shareBtnElem = body.querySelector('button');//공유하기 버튼
                //fetch로 이미지를 백엔드에 전송
                shareBtnElem.addEventListener('click', function() {
                    const files = frmElem.imgs.files;//이미지파일

                    const fData = new FormData();//creater element('form')
                    for(let i=0; i<files.length; i++) {
                        fData.append('imgs[]', files[i]);//fData안에 이미지를 배열로 집어넣는다.
                    }
                    fData.append('ctnt', body.querySelector('textarea').value);//문구에 들어간 문자열
                    fData.append('location', body.querySelector('input[type=text]').value);//위치에들어간 문자열

                    fetch('/feed/rest', {// post방식으로 body에 fData를 박아서
                        method: 'post',
                        body: fData                       
                    }).then(res => res.json())
                        .then(myJson => {
                            console.log(myJson);
                            if(myJson) {                                
                                btnClose.click();
                                const lData = document.querySelector('#lData');
                                const gData = document.querySelector('#gData');
                                if(lData && lData.dataset.toiuser !== gData.dataset.loginiuser) { return; }
                                // 남의 feedWin이 아니라면 화면에 등록!!!
                                const feedItem = feedObj.makeFeedItem(myJson);
                                feedObj.containerElem.prepend(feedItem);
                                feedObj.refreshSwipe();
                            }
                        });
                        
                });
            }
        });

        btnNewFeedModal.addEventListener('click', function() {//+버튼을 누르면 컴퓨터에서 선택 버튼생성
            const selFromComBtn = document.createElement('button');
            selFromComBtn.type = 'button';
            selFromComBtn.className = 'btn btn-primary';
            selFromComBtn.innerText = '컴퓨터에서 선택';            
            selFromComBtn.addEventListener('click', function() {
                frmElem.imgs.click();//클릭시 파일업로드기능 input type=file name=imgs클릭
            });
            body.innerHTML = null;//공간초기화
            body.appendChild(selFromComBtn);//버튼추가
        });
    }

})();