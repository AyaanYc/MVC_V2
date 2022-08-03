<?php
    function getJson() {
        return json_decode(file_get_contents('php://input'), true);//post로 json객체 보낸걸 배열로 받음
    }

    function getParam($key) {
        return isset($_GET[$key]) ? $_GET[$key] : "";
    }
    
    function getUrl() {
        return isset($_GET['url']) ? rtrim($_GET['url'], '/') : "";
    }
    function getUrlPaths() {
        $getUrl = getUrl();        
        return $getUrl !== "" ? explode('/', $getUrl) : "";
    }

    function getMethod() {// 현재 요청하는 데이터 요청 방식이 GET 이냐 POST 냐를 갈챠 주는 서버 함수 입니다.
        return $_SERVER['REQUEST_METHOD'];
    }

    function isGetOne() {
        $urlPaths = getUrlPaths();
        if(isset($urlPaths[2])) { //one
            return $urlPaths[2];
        }
        return false;
    }
    