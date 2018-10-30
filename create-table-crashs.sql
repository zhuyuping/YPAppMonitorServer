/*
 Navicat MySQL Data Transfer

 Source Server         : 127.0.0.1
 Source Server Version : 50621
 Source Host           : localhost
 Source Database       : RUNOOB

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 05/18/2016 11:44:07 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `appCrashs`;
CREATE TABLE `appCrashs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` char(50) NOT NULL DEFAULT '' COMMENT '唯一标识',
  `content` TEXT(65535) COMMENT '内容',
  `type` int(2) NOT NULL DEFAULT 0 COMMENT '类型',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
