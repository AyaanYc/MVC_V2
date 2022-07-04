<?php
namespace application\libs;

require_once "application/utils/UrlUtils.php";
require_once "application/utils/SessionUtils.php";
require_once "application/utils/FileUtils.php";

class Application{
    
    public $controller;
    public $action;
    private static $modelList = [];//배열에담아서 스테틱메모리에 넣어서 한번만만들고 계속 돌려씀

    public function __construct() {        
        $urlPaths = getUrlPaths();//1,2차주소값 배열
        $controller = isset($urlPaths[0]) && $urlPaths[0] != '' ? $urlPaths[0] : 'board';
        $action = isset($urlPaths[1]) && $urlPaths[1] != '' ? $urlPaths[1] : 'index';

        if (!file_exists('application/controllers/'. $controller .'Controller.php')) {
            echo "해당 컨트롤러가 존재하지 않습니다.";
            exit();
        }

        $controllerName = 'application\controllers\\' . $controller . 'controller';                
        $model = $this->getModel($controller);//쿼리객체
        new $controllerName($action, $model);//$action은 1차주소값 $model은 1차주소값model
    }// 1차주소값controller(1차주소값,1차주소값model)

    public static function getModel($key) {
        if(!in_array($key, static::$modelList)) {
            $modelName = 'application\models\\' . $key . 'model';
            static::$modelList[$key] = new $modelName();
        }
        return static::$modelList[$key];
    }//있으면 만들어서주고 없으면 만들어놧던걸 줌
}

