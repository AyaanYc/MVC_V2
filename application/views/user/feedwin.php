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
            <div class="flex-grow-1 d-flex flex-column justify-content-evenly ps-3">
                <div><?=$this->data->email?></div>
                <div class="d-flex flex-row">
                    <div class="flex-grow1 me-3">게시물 <span class="bold"><?=$this->data->feedcnt?></span></div>
                    <div class="flex-grow1 me-3">팔로워 <span class="bold">4M</span></div>
                    <div class="flex-grow1">팔로우 <span class="bold">235</span></div>
                </div>
                <div class="bold"><?=$this->data->nm?></div>
                <div><?=$this->data->cmt?></div>
            </div>
            <div>
                <?php
                    if($this->data->meyou === 1){?>
                        <button>팔로우취소</button>
                    <?php } if($this->data->meyou === 0 && $this->data->youme === 1) { ?>
                        <button>맞팔로우</button>
                    <?php } if($this->data->meyou === 0 && $this->data->youme === 0) { ?>
                        <button class="follow">팔로우</button>
                <?php } ?>
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