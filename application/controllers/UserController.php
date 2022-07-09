<?php
namespace application\controllers;

use application\libs\Application;

class UserController extends Controller {
    //로그인
    public function signin() {
        switch(getMethod()) {
            case _GET:
                return "user/signin.php";
            case _POST:
                $email = $_POST['email'];
                $pw = $_POST['pw'];           
                $param = ["email" => $_POST['email']];
                $dbUser = $this->model->selUser($param);
                if(!$dbUser || !password_verify($pw, $dbUser->pw)) {                                                        
                    return "redirect:signin?email={$email}&err";
                }
                $dbUser->pw = null;
                $dbUser->regdt = null;//메모리절약
                $this->flash(_LOGINUSER, $dbUser);
                return "redirect:/feed/index";
        }
    }
    //회원가입
    public function signup() {
        $ip_addr = $_SERVER["REMOTE_ADDR"];
        switch(getMethod()) {
            case _GET:
                return "user/signup.php";
            case _POST:
                $param = [
                    "email" => $_POST["email"],
                    "pw" => $_POST["pw"],
                    "nm" => $_POST["nm"],
                    "addr" => $ip_addr
                ];
                $param["pw"] = password_hash($param["pw"], PASSWORD_BCRYPT);
                $this->model->insUser($param);
                return "redirect:signin";
        }
    }
    //로그아웃
    public function logout() {
        $this->flash(_LOGINUSER);
        return "redirect:/user/signin";
    }

    public function feedwin() {
        $iuser = isset($_GET["iuser"]) ? intval($_GET["iuser"]) : 0;
        $param = [ 
            "feediuser" => $iuser,
            "loginiuser" => getIuser()
        ];
        $this->addAttribute(_DATA, $this->model->selUserProfile($param));
        $this->addAttribute(_JS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.js"]);        
        $this->addAttribute(_CSS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.css", "feed/index"]);        
        $this->addAttribute(_MAIN, $this->getView("user/feedwin.php"));
        return "template/t1.php"; 
    }

    //글쓴이의 피드리스트를 리턴
    public function feed() {//feedwin.js에서 호출
        if(getMethod() === _GET) {    
            $page = 1;
            if(isset($_GET["page"])) {
                $page = intval($_GET["page"]);
            }
            $startIdx = ($page - 1) * _FEED_ITEM_CNT;
            $param = [
                "startIdx" => $startIdx,
                "toiuser" => $_GET["iuser"],
                "loginiuser" => getIuser()
            ];        
            $list = $this->model->selFeedList($param);//글쓴이의 피드리스트가 배열,객체로담김
            foreach($list as $item) {                 
                $param2 = [ "ifeed" => $item->ifeed];
                $item->imgList = Application::getModel("feed")->selFeedImgList($param2);
                $item->cmt = Application::getModel("feedcmt")->selFeedCmt($param2);
            }//                스테틱메소드로 메모리에 올린 feed&feedcmt Model
            return $list;
        }
    }

    //좋아요 등록,취소
    public function follow() { 
        $param = [
            "fromiuser" => getIuser()
        ];

        switch(getMethod()) {
            case _POST:                            
                $json = getJson();
                $param["toiuser"] = $json["toiuser"];    
                return [_RESULT => $this->model->insUserFollow($param)];
            case _DELETE:                
                $param["toiuser"] = $_GET["toiuser"];    
                return [_RESULT => $this->model->delUserFollow($param)];
        }
    }

    //프로필사진 업로드,삭제
    public function profile() { 
        switch(getMethod()) {
            case _DELETE://삭제
                $loginUser = getLoginUser();
                if($loginUser) {
                    $path = "static/img/profile/{$loginUser->iuser}/{$loginUser->mainimg}";
                    if(file_exists($path) && unlink($path)) {
                        $param = [
                            "iuser" => $loginUser->iuser,
                            "delMainImg" => 1
                        ];
                        if($this->model->updUser($param)) {
                            $loginUser->mainimg = null;
                            return [_RESULT => 1];
                        }
                    }
                }
                return [_RESULT => 0];
            case _POST://업로드
                $loginUser = getLoginUser();
                $saveDirectory = _IMG_PATH . "/profile/" . $loginUser->iuser;
                if(!is_dir($saveDirectory)) {
                    mkdir($saveDirectory, 0777, true);
                }
                $tempName = $_FILES['img']['tmp_name'];
                $originFileNm = $_FILES['img']['name'];
                $randomFileNm = getRandomFileNm($originFileNm);
                if(move_uploaded_file($tempName, $saveDirectory . "/" . $randomFileNm)) {
                    $param = [
                        "iuser" => $loginUser->iuser,
                        "mainimg" => $randomFileNm
                    ];
                    $this->model->updUser($param);
                    if($loginUser->mainimg) {
                        $saved_img = $saveDirectory . "/" . $loginUser->mainimg;
                        if(file_exists($saved_img)) {
                            unlink($saved_img);
                        }
                    }
                    $loginUser->mainimg = $randomFileNm;
                    return [_RESULT => 1];
                }
                return [_RESULT => 0];
        }
    }
}