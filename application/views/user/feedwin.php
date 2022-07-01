<div class="d-flex flex-column align-items-center">
    <div class="size_box_100"></div>
    <div class="w100p_mw614">
        <div class="d-flex flex-row">            
                <div class="d-flex flex-column justify-content-center">
                    <div class="circleimg h150 w150 pointer feedwin">
                        <img data-bs-toggle="modal" data-bs-target="#newProfileModal" src='/static/img/profile/<?=$this->data->iuser?>/<?=$this->data->mainimg?>' onerror='this.error=null;this.src="/static/img/profile/defaultProfileimg.png"'>
                    </div>
                    <?php 
                    print_r($this->data);
                    ?>;
                </div>

            <div></div>
        </div>
    </div>
    <div class="modal fade" id="newProfileModal" tabindex="-1" aria-labelledby="newProfileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" id="newProfileModalContent">
            <div class="modal-header d-flex justify-content-center">
                <h5 class="modal-title">프로필 사진 바꾸기</h5>
            </div>
            <div class="modal-body" id="id-modal-body">
                <button>사진 업로드</button>
                <button>현재 사진 삭제</button>
                <button>취소</button>
            </div>
        </div>
    </div>
</div>
</div>