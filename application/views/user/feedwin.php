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
                <div><?=$this->data->email?>
                <?php 
                    $youme = $this->data->youme;
                    $meyou = $this->data->meyou;
                    $iuser = $this->data->iuser;
                ?>
                    <?php if($iuser === getIuser()) { ?>
                        <button type="button" id="btnModProfile" class="btn btn-outline-secondary">프로필 수정</button>
                    <?php } else if($meyou === 0 && $youme === 1) { ?>
                        <button type="button" id="btnFollow" data-follow="0" class="btn btn-primary">맞팔로우 하기</button>
                    <?php } else if($meyou === 0 && $youme === 0 && $iuser !== getIuser()) { ?>
                        <button type="button" id="btnFollow" data-follow="0" class="btn btn btn-primary">팔로우</button>
                    <?php } else if($meyou === 1) { ?>
                        <button type="button" id="btnFollow" data-follow="1" class="btn btn-outline-secondary">팔로우취소</button>
                    <?php } ?>
                </div>
                <div class="d-flex flex-row">
                    <div class="flex-grow1 me-3">게시물 <span class="bold"><?=$this->data->feedcnt?></span></div>
                    <div class="flex-grow1 me-3">팔로워 <span class="bold">4M</span></div>
                    <div class="flex-grow1">팔로우 <span class="bold">235</span></div>
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