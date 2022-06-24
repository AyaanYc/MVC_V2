<?php
namespace application\controllers;

class UserController extends Controller {
    public function signin() {
        switch(getMethod()) {
            case _GET:
                return "user/signin.php";
            case _POST:
                $param = [
                    "email" => $_POST["email"],
                    "pw" => $_POST["pw"],
                ];
                $dbUser = $this->model->selUser($param);
                if($dbUser === false) { //아이디 없음
                    print "아이디 없음 <br>";
                    return"user/signin.php";
                } else if(!password_verify($param["pw"], $dbUser->pw)) { //비밀번호확인
                    print "비밀번호 다름 <br>";
                    return "user/signin.php";
                }
                $this->flash(_LOGINUSER, $dbUser);
                return "redirect:/feed/index";
        }
    }

    public function signup() {
        // if(getMethod() === _GET) {
        //     return "user/signup.php";
        // } else if(getMethod() === _POST) {
        //     return "redirect:signin";
        // }

        switch(getMethod()) {
            case _GET:
                return "user/signup.php";
            case _POST:
                $param = [
                    "email" => $_POST["email"],
                    "pw" => $_POST["pw"],
                    "nm" => $_POST["nm"]
                ];
                $param["pw"] = password_hash($param["pw"], PASSWORD_BCRYPT);
                $this->model->insUser($param);
                return "redirect:signin";
        }
    }
}