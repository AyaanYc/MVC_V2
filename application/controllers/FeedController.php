<?php
namespace application\controllers;

use application\libs\Application;

class FeedController extends Controller {
    public function index() {
        $this->addAttribute(_MAIN, $this->getView("feed/index.php"));
        $this->addAttribute(_JS, ["feed/index", "https://unpkg.com/swiper@8/swiper-bundle.min.js"]);
        $this->addAttribute(_CSS, ["feed/index", "https://unpkg.com/swiper@8/swiper-bundle.min.css"]);
        return "template/t1.php";
    }

    // public function rest() {
    //     switch(getMethod()) {
    //         case _POST:
    //             //insFeed 메소드 호출하고 리턴값 받은다음
    //             // $result = 1;
    //             $location = $_POST['location'];
    //             $ctnt = $_POST['ctnt'];           
    //             $iuser = getIuser();           
    //             $param = [
    //                 "location" => $location,
    //                 "ctnt" => $ctnt,
    //                 "iuser" => $iuser
    //             ];
    //             $r = $this->model->insFeed($param);
    //             return ["result" => $r];
    //     }
    // }

    public function rest() {
        switch(getMethod()) {
            case _POST://index.js에서 공유하기버튼 눌렀을때 호출(feed자료등록)
                if(!is_array($_FILES) || !isset($_FILES["imgs"])) {
                    return ["result" => 0];
                }
                $location = $_POST['location'];
                $ctnt = $_POST['ctnt'];           
                $iuser = getIuser();           
                $param = [
                    "location" => $location,
                    "ctnt" => $ctnt,
                    "iuser" => $iuser
                ];
                $ifeed = $this->model->insFeed($param);
                $paramImg = [ "ifeed" => $ifeed ];//한번만 넣어주면되기때문에 따로작성
                foreach($_FILES["imgs"]["name"] as $key => $originFileNm) {
                    $saveDirectory = _IMG_PATH . "/feed/" . $ifeed; //static/img/feed/ifeed
                    if(!is_dir($saveDirectory)) {
                        mkdir($saveDirectory, 0777, true);
                    }
                    $tempName = $_FILES['imgs']['tmp_name'][$key];
                    $randomFileNm = getRandomFileNm($originFileNm);
                    if(move_uploaded_file($tempName, $saveDirectory . "/" . $randomFileNm)) {
                        //chmod($saveDirectory . "/test." . $ext, octdec("0666"));
                        //chmod("C:/Apache24/PHPgram/static/img/profile/1/test." . $ext, 0755);
                        $paramImg["img"] = $randomFileNm;
                        $this->model->insFeedImg($paramImg);
                    }
                }
                $param2 = [ "ifeed" => $ifeed ];
                $data = $this->model->selFeedAfterReg($param2);
                $data->imgList = $this->model->selFeedImgList($param2);
                return $data;

            case _GET: //피드리스트를보여줌
                $page = 1;
                if(isset($_GET["page"])) {
                    $page = intval($_GET["page"]);
                }
                $startIdx = ($page - 1) * _FEED_ITEM_CNT;
                $param = [
                    "startIdx" => $startIdx,
                    "iuser" => getIuser()
                ];                
                $list = $this->model->selFeedList($param);
                foreach($list as $item) {
                    $param2 = ["ifeed" => $item->ifeed];
                    $item->imgList = $this->model->selFeedImgList($param2);
                    $item->cmt = Application::getModel("feedcmt")->selFeedCmt($param2);
                }
                return $list;
        }
    }
    public function fav()//좋아요기능
    {
        $urlPaths = getUrlPaths();
        if (!isset($urlPaths[2])) {
            exit();
        }

        $param = [
            'ifeed' => intval($urlPaths[2]),
            'iuser' => getIuser(),
        ];
        switch (getMethod()) {
            case _POST:
                $result = $this->model->insFeedFav($param);
                return [_RESULT => $result];
            case _DELETE:
                $result = $this->model->delFeedFav($param);
                return [_RESULT => $result];
        }
    }
}