(function() {
    const btnNewFeedModal = document.querySelector('#btnNewFeedModal');//+버튼
    if(btnNewFeedModal) {//+버튼이 있으면 
        const modal = document.querySelector('#newFeedModal');
        const body =  modal.querySelector('#id-modal-body');
        const frmElem = modal.querySelector('form');

        //이미지 값이 변하면
        frmElem.imgs.addEventListener('change', function(e) { //input name=imgs접근 type=file

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

                // $btn_close = document.querySelector(".btn-close");
                // $btn_close.addEventListener("click", function())

                const shareBtnElem = body.querySelector('button');//공유하기 버튼
                shareBtnElem.addEventListener('click', function() {//fetch로 이미지를 백엔드에 전송
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
                            const closeBtn = modal.querySelector('.btn-close');//btn.close를 찾고 클릭함(x버튼)
                            closeBtn.click();
                            // if(feedObj && myJson.result) { // 객체와 객체가 있다면
                            //     feedObj.refreshList(); //메소드호출(현재페이지를 1로바꾸고 공간초기화, 새로추가된것을 넣음 common_feed.js)
                            // }
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

    const feedObj = {
        limit: 20,
        itemLength: 0,
        currentPage: 1,
        loadingElem: document.querySelector('.loading'),
        containerElem: document.querySelector('#item_container'),

        getFeedList: function() {
            this.showLoading();            
            const param = {
                page: this.currentPage++
            }
            fetch('/feed/rest' + encodeQueryString(param))
            .then(res => res.json())
            .then(list => {
                console.log(list);
                this.makeFeedList(list);
            })
            .catch(e => {
                console.error(e);
                this.hideLoading();
            });
        },
        makeFeedList: function(list) {//item을 받아서 리스트(div)에추가
            if(list.length !== 0) {
                list.forEach(item => {
                    const divItem = this.makeFeedItem(item);
                    this.containerElem.appendChild(divItem);
                });
            }
            this.hideLoading();
        },
        makeFeedItem: function(item) {//item을 만들어서 return
            console.log(item);
            const divContainer = document.createElement("div");
            divContainer.className = 'item mt-3 mb-3 list';

            const divTop = document.createElement('div');
            divContainer.appendChild(divTop);
            const regDtInfo = getDateTimeInfo(item.regdt);
            divTop.className = 'd-flex flex-row ps-3 pe-3';
            const writerImg = `<img src='/static/img/profile/${item.iuser}/${item.mainimg}' 
                onerror='this.error=null;this.src="/static/img/profile/defaultProfileimg.png"'>`;
            divTop.innerHTML = `
                <div class="d-flex flex-column justify-content-center">
                    <div class="circleimg h40 w40">${writerImg}</div>
                </div>
                <div class="p-3 flex-grow-1">
                    <div><span class="pointer" onclick="moveTopProfile(${item.iuser});">${item.writer}</span> - ${regDtInfo}</div>
                    <div>${item.location === null ? '' : item.location}</div>
                </div>   
            `;

            const divImgSwiper = document.createElement('div');
            divContainer.appendChild(divImgSwiper);
            divImgSwiper.className = 'swiper item_img';
            divImgSwiper.innerHTML = `
                <div class="swiper-wrapper"></div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            `;
            const divSwiperWrapper = divImgSwiper.querySelector('.swiper-wrapper');
            console.log(divSwiperWrapper);
            // imgList forEach 돌릴예정
            const imgObj = item.imgList[0];
            const divSwiperSlide = document.createElement('div');
            divSwiperWrapper.appendChild(divSwiperSlide);
            divSwiperSlide.classList.add('swiper-slide');

            const img = document.createElement('img');
            divSwiperSlide.appendChild(img);
            img.className = 'w614';
            console.log(item.ifeed);
            img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;
            
            return divContainer;
        },

        showLoading: function() { this.loadingElem.classList.remove('d-none'); },
        hideLoading: function() { this.loadingElem.classList.add('d-none'); }

    }
    feedObj.getFeedList();



})();