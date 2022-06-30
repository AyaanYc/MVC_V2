<?php
namespace application\controllers;

class Controller {    
    protected $model;
    private static $needLoginUrlArr = [
        "feed", "user/feedwin"
    ];

    public function __construct($action, $model) {    
        if(!isset($_SESSION)) {
            session_start();
        }    
        $urlPaths = getUrl();
        foreach(static::$needLoginUrlArr as $url) {
            if(strpos( $urlPaths, $url) === 0 && !isset($_SESSION[_LOGINUSER])) {
                $this->getView("redirect:/user/signin");
                echo "권한이 없습니다.";
                exit();// 로그인을 바로 안하면
            }
        }

        $this->model = $model;//쿼리객체(UserModel or FeedModel)
        $view = $this->$action();
        if(empty($view) && gettype($view) === "string") {//배열에 아무것도 안들어있어도 에러발생시켜서 gettype메소드추가
            echo "Controller 에러 발생";
            exit();
        }

        if(gettype($view) === "string") {
            require_once $this->getView($view);             
        } else if(gettype($view) === "object" || gettype($view) === "array") {
            header("Content-Type:application/json");
            echo json_encode($view);// 배열&객체가 넘어온다면 json형식의문자열로 변환
        }        
    }
    private function chkLoginUrl() {

    }
    
    protected function addAttribute($key, $val) {
        $this->$key = $val;
    }

    protected function getView($view) {
        if(strpos($view, "redirect:") === 0) {
            header("Location: " . substr($view, 9));
            exit();
        }
        return _VIEW . $view;
    }

    protected function flash($name = '', $val = '') {
        if(!empty($name)) { //공백이 아니면
            if(!empty($val)) {
                $_SESSION[$name] = $val;
            } else if(empty($val) && !empty($_SESSION[$name])) {
                unset($_SESSION[$name]);
            }
        }
    }
}
