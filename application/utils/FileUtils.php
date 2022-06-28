<?php
    //확장자리턴해주는함수
    function getExt($fileName) {
        $last_index = mb_strrpos($fileName, ".");
        $ext = mb_substr($fileName, $last_index + 1);
        return $ext;
    }

    // function getExt2($url) {
    //     $file_name = explode(".", $url);
    //     $ext = end($file_name); // 확장자 자르기
    //     return $ext;
    // }
    
    // function getExt3($fileName) {
    //     return pathinfo($fileName, PATHINFO_EXTENSION);
    // }

    function gen_uuid_v4() { 
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x'
            , mt_rand(0, 0xffff)
            , mt_rand(0, 0xffff)
            , mt_rand(0, 0xffff)
            , mt_rand(0, 0x0fff) | 0x4000
            , mt_rand(0, 0x3fff) | 0x8000
            , mt_rand(0, 0xffff)
            , mt_rand(0, 0xffff)
            , mt_rand(0, 0xffff) 
        ); 
    }

    function getRandomFileNm($file) {
        return gen_uuid_v4() . "." . getExt($file); 
    }