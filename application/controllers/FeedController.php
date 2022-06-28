<?php
namespace application\controllers;

class FeedController extends Controller {
    public function index() {
        $this->addAttribute(_MAIN, $this->getView("feed/index.php"));
        $this->addAttribute(_JS, ["feed/index"]);
        return "template/t1.php";
    }

    public function rest() {
        print "method : " . getMethod() . "<br>";
        switch(getMethod()) {
            case _POST:
                if(is_array($_FILES)){
                    foreach($_FILES['imgs']['name'] as $key => $value) {
                        print "key : ${key}, value: {$value} <br>";
                    }
                }
                // $countfiles = count($_FILES['imgs']['name']);
                print "ctnt : " . $_POST["ctnt"] . "<br>";
                print "location : " . $_POST["location"] . "<br>";
        }
    }
}