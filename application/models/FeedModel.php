<?php
namespace application\models;
use PDO;

class FeedModel extends Model {
    public function insFeed(&$param) {
        $sql = "INSERT INTO t_feed
                (location, ctnt, iuser)
                VALUES
                (:location, :ctnt, :iuser)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":location", $param["location"]);
        $stmt->bindValue(":ctnt", $param["ctnt"]);
        $stmt->bindValue(":iuser", $param["iuser"]);
        $stmt->execute();
        return intval($this->pdo->lastInsertId());   //pk값이들어감 
    }

    public function insFeedImg(&$param) {
        $sql = "INSERT INTO t_feed_img
                (ifeed, img)
                VALUES
                (:ifeed, :img)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":ifeed", $param["ifeed"]);
        $stmt->bindValue(":img", $param["img"]);        
        $stmt->execute();
        return $stmt->rowCount(); //영향을미친 레코드(행) 숫자 1
    }
}   