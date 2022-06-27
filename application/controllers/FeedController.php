<?php
namespace application\controllers;

class FeedController extends Controller {
    public function index() {
        $this->addAttribute(_MAIN, $this->getView("feed/index.php"));
        $this->addAttribute(_JS, ["feed/index"]);
        return "template/t1.php";
    }
}