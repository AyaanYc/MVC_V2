<?php
namespace application\controllers;

class FeedCmtController extends Controller {

    public function index() {
        switch(getMethod()) {
            case _POST:
                $json = getJson();//post로 날라온 json데이터를 배열로받음
                $json['iuser'] = getIuser();//세션값만 따로 받아옴
                return [_RESULT => $this->model->insFeedCmt($json)];
        }
    }
}

