<div class="d-flex flex-column align-items-center">
    <div class="size_box_100"></div>
    <div class="w100p_mw614">
        <div class="d-flex flex-row">            
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <div class="circleimg h150 w150 pointer feedwin">
                        <img data-bs-toggle="modal" data-bs-target="#newProfileModal" src='/static/img/profile/<?=$this->data->iuser?>/<?=$this->data->mainimg?>' onerror='this.error=null;this.src="/static/img/profile/defaultProfileimg.png"'>
                    </div>
                    <?php 
                    // print_r($this->data);
                    ?>
                </div>
            <div class="flex-grow-1 d-flex flex-column justify-content-evenly">
                <div><?=$this->data->email?></div>
                <div class="d-flex flex-row">
                    <div class="flex-grow1">게시물 <span>18</span></div>
                    <div class="flex-grow1">팔로워 <span>43345</span></div>
                    <div class="flex-grow1">팔로우 <span>235</span></div>
                </div>
                <div class="bold"><?=$this->data->nm?></div>
                <div><?=$this->data->cmt?></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="newProfileModal" tabindex="-1" aria-labelledby="newProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered justify-content-center">
            <div class="modal-content d-flex justify-content-center" id="newProfileModalContent">
                <div class="modal-header d-flex justify-content-center">
                    <h5 class="modal-title">프로필 사진 바꾸기</h5>
                </div>
                <div class="modal-body" id="profileModal-body">
                    <button class="pu">사진 업로드</button>
                    <button class="pu">현재 사진 삭제</button>
                    <button class="pu">취소</button>
                </div>
            </div>
        </div>
    </div>
</div>