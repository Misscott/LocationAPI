CREATE DATABASE  IF NOT EXISTS `dbmaster` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbmaster`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: ls-f85b70f391f2c9e6cf335dafef04161a8a719f25.cf88wacmc99x.eu-west-3.rds.amazonaws.com    Database: dbmaster
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `endpoints`
--

DROP TABLE IF EXISTS `endpoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endpoints` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endpoints`
--

LOCK TABLES `endpoints` WRITE;
/*!40000 ALTER TABLE `endpoints` DISABLE KEYS */;
INSERT INTO `endpoints` VALUES (1,'c90c6011-18bf-11f0-bcd6-f0a6542bbddc','/','2025-04-14 01:34:03','system',NULL,NULL),(2,'c9145262-18bf-11f0-bcd6-f0a6542bbddc','/login','2025-04-14 01:34:03','system',NULL,NULL),(3,'c918b1d4-18bf-11f0-bcd6-f0a6542bbddc','/signin','2025-04-14 01:34:04','system',NULL,NULL),(4,'c91c227f-18bf-11f0-bcd6-f0a6542bbddc','/refresh_token','2025-04-14 01:34:04','system',NULL,NULL),(5,'c91fe14b-18bf-11f0-bcd6-f0a6542bbddc','/users','2025-04-14 01:34:04','system',NULL,NULL),(6,'c923bed4-18bf-11f0-bcd6-f0a6542bbddc','/users/:uuid','2025-04-14 01:34:04','system',NULL,NULL),(7,'c927576b-18bf-11f0-bcd6-f0a6542bbddc','/endpoints','2025-04-14 01:34:04','system',NULL,NULL),(8,'c92b0375-18bf-11f0-bcd6-f0a6542bbddc','/endpoints/:uuid','2025-04-14 01:34:04','system',NULL,NULL),(9,'c92e9301-18bf-11f0-bcd6-f0a6542bbddc','/places','2025-04-14 01:34:04','system',NULL,NULL),(10,'c931ffbb-18bf-11f0-bcd6-f0a6542bbddc','/places/:uuid','2025-04-14 01:34:04','system',NULL,NULL),(11,'c9359b8b-18bf-11f0-bcd6-f0a6542bbddc','/reports','2025-04-14 01:34:04','system',NULL,NULL),(12,'c938ebf3-18bf-11f0-bcd6-f0a6542bbddc','/reports/:uuid','2025-04-14 01:34:04','system',NULL,NULL),(13,'43ac632f-18c0-11f0-bcd6-f0a6542bbddc','/coordinates','2025-04-14 01:37:29','system',NULL,NULL),(14,'43b303ea-18c0-11f0-bcd6-f0a6542bbddc','/coordinates/:uuid','2025-04-14 01:37:29','system',NULL,NULL),(15,'43b6d078-18c0-11f0-bcd6-f0a6542bbddc','/report_types','2025-04-14 01:37:29','system',NULL,NULL),(16,'43badb3c-18c0-11f0-bcd6-f0a6542bbddc','/report_types/:uuid','2025-04-14 01:37:29','system',NULL,NULL),(17,'43be97a6-18c0-11f0-bcd6-f0a6542bbddc','/permissions','2025-04-14 01:37:29','system',NULL,NULL),(18,'43c28b6b-18c0-11f0-bcd6-f0a6542bbddc','/permissions/:uuid','2025-04-14 01:37:29','system',NULL,NULL),(19,'43c65954-18c0-11f0-bcd6-f0a6542bbddc','/roles','2025-04-14 01:37:29','system',NULL,NULL),(20,'43ca2a0a-18c0-11f0-bcd6-f0a6542bbddc','/roles/:uuid','2025-04-14 01:37:29','system',NULL,NULL),(21,'43ce0ba1-18c0-11f0-bcd6-f0a6542bbddc','/roles_has_permissions','2025-04-14 01:37:29','system',NULL,NULL),(22,'43d19f4b-18c0-11f0-bcd6-f0a6542bbddc','/roles_has_permissions/:uuid','2025-04-14 01:37:29','system',NULL,NULL),(23,'5149c00c-1cc4-11f0-ba63-060220af8957','/users/:user_uuid/places','2025-04-19 02:16:35','system',NULL,NULL),(24,'5153442a-1cc4-11f0-ba63-060220af8957','/users/:user_uuid/places/:place_uuid','2025-04-19 02:16:35','system',NULL,NULL),(25,'24584b6c-1ed6-11f0-ba63-060220af8957','/users/:user_uuid/reports','2025-04-21 17:29:13','system',NULL,NULL),(26,'24645559-1ed6-11f0-ba63-060220af8957','/places/:place_uuid/reports','2025-04-21 17:29:13','system',NULL,NULL);
/*!40000 ALTER TABLE `endpoints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `fk_place` bigint NOT NULL,
  `fk_user` bigint NOT NULL,
  `created` datetime NOT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `active` tinyint(1) GENERATED ALWAYS AS (if((`deleted` is null),1,NULL)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  UNIQUE KEY `deleted_unique` (`fk_user`,`fk_place`,`active`),
  KEY `fk_places_has_users_users1_idx` (`fk_user`),
  KEY `fk_places_has_users_places1_idx` (`fk_place`),
  CONSTRAINT `fk_places_has_users_places1` FOREIGN KEY (`fk_place`) REFERENCES `places` (`id`),
  CONSTRAINT `fk_places_has_users_users1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` (`id`, `uuid`, `fk_place`, `fk_user`, `created`, `createdBy`, `deleted`, `deletedBy`) VALUES (70,'3df6dcdd-bf94-4ea3-a2a2-345984158b87',59,1,'2025-05-28 04:32:49','6a7e8bd1-18c2-11f0-bcd6-f0a6542bbddc',NULL,NULL);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `action` enum('GET','POST','PUT','DELETE') NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `fk_endpoint` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_permissions_endpoints1_idx` (`fk_endpoint`),
  CONSTRAINT `fk_permissions_endpoints1` FOREIGN KEY (`fk_endpoint`) REFERENCES `endpoints` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'56a8b346-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,2),(2,'56aff39b-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,3),(3,'56b3f311-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,4),(4,'56b7cc21-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,5),(5,'56bb82af-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,5),(6,'56bf2816-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,6),(7,'56c29974-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,6),(8,'56c65888-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,6),(9,'56c9e2fc-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,7),(10,'56cdc103-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,7),(11,'56d155ab-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,8),(12,'56d4d398-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,8),(13,'56d89c68-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,8),(14,'56dbf92f-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,9),(15,'56dfd039-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,9),(16,'56e39127-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,10),(17,'56e73589-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,10),(18,'56eae6e4-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,10),(19,'56ee8ada-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,11),(20,'56f23157-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,11),(21,'56f5bf11-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,12),(22,'56f94602-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,12),(23,'56fcf155-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,12),(24,'570095ce-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,13),(25,'57042ac6-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,13),(26,'5707960f-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,14),(27,'570b4937-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,14),(28,'570ef3bd-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,14),(29,'57127136-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,15),(30,'57164638-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,15),(31,'5719b4ce-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,16),(32,'571d822e-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,16),(33,'572171c4-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,16),(34,'5724cc13-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,17),(35,'5728f7b6-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,17),(36,'572c9947-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,18),(37,'57303bcf-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:11','system',NULL,NULL,18),(38,'5733ef08-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:11','system',NULL,NULL,18),(39,'57380526-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,19),(40,'573bbae0-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:11','system',NULL,NULL,19),(41,'573f3075-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:11','system',NULL,NULL,20),(42,'5742b7da-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:12','system',NULL,NULL,20),(43,'5746ba58-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:12','system',NULL,NULL,20),(44,'574ab3ce-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:12','system',NULL,NULL,21),(45,'574e7053-18c1-11f0-bcd6-f0a6542bbddc','POST','2025-04-14 01:45:12','system',NULL,NULL,21),(46,'57525319-18c1-11f0-bcd6-f0a6542bbddc','GET','2025-04-14 01:45:12','system',NULL,NULL,22),(47,'575605c9-18c1-11f0-bcd6-f0a6542bbddc','PUT','2025-04-14 01:45:12','system',NULL,NULL,22),(48,'5759c768-18c1-11f0-bcd6-f0a6542bbddc','DELETE','2025-04-14 01:45:12','system',NULL,NULL,22),(49,'ba98c928-1cc4-11f0-ba63-060220af8957','GET','2025-04-19 02:19:31','system',NULL,NULL,23),(50,'ba98eb31-1cc4-11f0-ba63-060220af8957','POST','2025-04-19 02:19:31','system',NULL,NULL,23),(51,'ba98ec89-1cc4-11f0-ba63-060220af8957','DELETE','2025-04-19 02:19:31','system',NULL,NULL,23),(52,'baa3568d-1cc4-11f0-ba63-060220af8957','GET','2025-04-19 02:19:31','system',NULL,NULL,24),(53,'baa35da7-1cc4-11f0-ba63-060220af8957','PUT','2025-04-19 02:19:31','system',NULL,NULL,24),(54,'baa35e7d-1cc4-11f0-ba63-060220af8957','DELETE','2025-04-19 02:19:31','system',NULL,NULL,24),(55,'4f6749b8-1ed6-11f0-ba63-060220af8957','GET','2025-04-21 17:30:25','system',NULL,NULL,25),(56,'4f706d22-1ed6-11f0-ba63-060220af8957','GET','2025-04-21 17:30:25','system',NULL,NULL,26);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `places` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(11,7) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `images` json DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `places`
--

LOCK TABLES `places` WRITE;
/*!40000 ALTER TABLE `places` DISABLE KEYS */;
INSERT INTO `places` VALUES (58,'4bb3757e-2f92-444b-88c3-1327130c0f9f','Martico','Empresa','Pl. dels Arquitectes Calvo, 1, El Pla del Real, 46023 València, Valencia, España',39.4669325,-0.3593915,'2025-05-16 14:46:19',NULL,NULL,NULL,NULL),(59,'ec47e994-29b5-4017-b89f-155109b636da','Starbucks Ruzafa','Cafetería','C/ de Roger de Llòria, 4, Ciutat Vella, 46002 València, Valencia, España',39.4690373,-0.3750426,'2025-05-23 15:23:48','[\"https://locationapi-m13l.onrender.com/public/5de7525df20107d46e8a2215d688f057.jpg\"]',NULL,NULL,NULL);
/*!40000 ALTER TABLE `places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_report_type`
--

DROP TABLE IF EXISTS `report_report_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_report_type` (
  `report_uuid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `report_type_uuid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`report_uuid`,`report_type_uuid`),
  KEY `report_type_uuid` (`report_type_uuid`),
  CONSTRAINT `report_report_type_ibfk_1` FOREIGN KEY (`report_uuid`) REFERENCES `users_has_places` (`uuid`) ON DELETE CASCADE,
  CONSTRAINT `report_report_type_ibfk_2` FOREIGN KEY (`report_type_uuid`) REFERENCES `report_types` (`uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_report_type`
--

LOCK TABLES `report_report_type` WRITE;
/*!40000 ALTER TABLE `report_report_type` DISABLE KEYS */;
INSERT INTO `report_report_type` VALUES ('3255aef1-160c-4765-8455-8671cdfd5e49','18b9bf6b-af47-466b-8a00-cec39dcdf8ca');
/*!40000 ALTER TABLE `report_report_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_types`
--

DROP TABLE IF EXISTS `report_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_types`
--

LOCK TABLES `report_types` WRITE;
/*!40000 ALTER TABLE `report_types` DISABLE KEYS */;
INSERT INTO `report_types` VALUES (1,'18b9bf6b-af47-466b-8a00-cec39dcdf8ca','wheelchair accessible','2025-04-18 13:10:54','7b4b26b3-c8b0-43c5-80d0-bca18b5807a5',NULL,NULL),(2,'048e0622-cda6-4e35-aab1-d4c555180627','ramp','2025-04-21 23:28:12','6a7e8bd1-18c2-11f0-bcd6-f0a6542bbddc',NULL,NULL),(3,'f60d9042-3b83-11f0-ba63-060220af8957','visual accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(4,'f6189183-3b83-11f0-ba63-060220af8957','hearing accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(5,'f622eb21-3b83-11f0-ba63-060220af8957','cognitive accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(6,'f62c0bcb-3b83-11f0-ba63-060220af8957','mobility accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(7,'f634d0b7-3b83-11f0-ba63-060220af8957','parking accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(8,'f63e7b6c-3b83-11f0-ba63-060220af8957','entrance accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(9,'f6477f2b-3b83-11f0-ba63-060220af8957','bathroom accessibility','2025-05-28 05:24:00',NULL,NULL,NULL),(10,'f6508b1a-3b83-11f0-ba63-060220af8957','elevator accessibility','2025-05-28 05:24:00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `report_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `name_active` varchar(255) GENERATED ALWAYS AS ((case when (`deleted` is null) then `name` else NULL end)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  UNIQUE KEY `name_active_UNIQUE` (`name_active`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `uuid`, `name`, `created`, `createdBy`, `deleted`, `deletedBy`) VALUES (1,'fdc4a4bd-18bd-11f0-bcd6-f0a6542bbddc','admin','2025-04-14 01:21:13','system',NULL,NULL),(2,'832be87c-1930-11f0-ba63-060220af8957','viewer','2025-04-14 13:00:59','system',NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_has_permissions`
--

DROP TABLE IF EXISTS `roles_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_has_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `fk_role` bigint NOT NULL,
  `fk_permission` bigint NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`fk_role`,`fk_permission`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_roles_has_permissions_permissions1_idx` (`fk_permission`),
  KEY `fk_roles_has_permissions_roles1_idx` (`fk_role`),
  CONSTRAINT `fk_roles_has_permissions_permissions1` FOREIGN KEY (`fk_permission`) REFERENCES `permissions` (`id`),
  CONSTRAINT `fk_roles_has_permissions_roles1` FOREIGN KEY (`fk_role`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_has_permissions`
--

LOCK TABLES `roles_has_permissions` WRITE;
/*!40000 ALTER TABLE `roles_has_permissions` DISABLE KEYS */;
INSERT INTO `roles_has_permissions` VALUES (1,'eb7633e2-18c1-11f0-bcd6-f0a6542bbddc',1,1,'2025-04-14 01:49:20','system',NULL,NULL),(2,'eb7ccf6e-18c1-11f0-bcd6-f0a6542bbddc',1,2,'2025-04-14 01:49:20','system',NULL,NULL),(3,'eb80a650-18c1-11f0-bcd6-f0a6542bbddc',1,3,'2025-04-14 01:49:20','system',NULL,NULL),(4,'eb8437f2-18c1-11f0-bcd6-f0a6542bbddc',1,4,'2025-04-14 01:49:20','system',NULL,NULL),(5,'eb87fb66-18c1-11f0-bcd6-f0a6542bbddc',1,5,'2025-04-14 01:49:20','system',NULL,NULL),(6,'eb8b94ad-18c1-11f0-bcd6-f0a6542bbddc',1,6,'2025-04-14 01:49:20','system',NULL,NULL),(7,'eb8ef5a4-18c1-11f0-bcd6-f0a6542bbddc',1,7,'2025-04-14 01:49:20','system',NULL,NULL),(8,'eb9283c5-18c1-11f0-bcd6-f0a6542bbddc',1,8,'2025-04-14 01:49:20','system',NULL,NULL),(9,'eb961e40-18c1-11f0-bcd6-f0a6542bbddc',1,9,'2025-04-14 01:49:20','system',NULL,NULL),(10,'eb99cd09-18c1-11f0-bcd6-f0a6542bbddc',1,10,'2025-04-14 01:49:20','system',NULL,NULL),(11,'eb9d49b2-18c1-11f0-bcd6-f0a6542bbddc',1,11,'2025-04-14 01:49:20','system',NULL,NULL),(12,'eba10eb0-18c1-11f0-bcd6-f0a6542bbddc',1,12,'2025-04-14 01:49:20','system',NULL,NULL),(13,'eba4d268-18c1-11f0-bcd6-f0a6542bbddc',1,13,'2025-04-14 01:49:20','system',NULL,NULL),(14,'eba871fa-18c1-11f0-bcd6-f0a6542bbddc',1,14,'2025-04-14 01:49:20','system',NULL,NULL),(15,'ebac782c-18c1-11f0-bcd6-f0a6542bbddc',1,15,'2025-04-14 01:49:21','system',NULL,NULL),(16,'ebb00542-18c1-11f0-bcd6-f0a6542bbddc',1,16,'2025-04-14 01:49:21','system',NULL,NULL),(17,'ebb39d1f-18c1-11f0-bcd6-f0a6542bbddc',1,17,'2025-04-14 01:49:21','system',NULL,NULL),(18,'ebb738a8-18c1-11f0-bcd6-f0a6542bbddc',1,18,'2025-04-14 01:49:21','system',NULL,NULL),(19,'ebbac95e-18c1-11f0-bcd6-f0a6542bbddc',1,19,'2025-04-14 01:49:21','system',NULL,NULL),(20,'ebbe8962-18c1-11f0-bcd6-f0a6542bbddc',1,20,'2025-04-14 01:49:21','system',NULL,NULL),(21,'ebc1dbbe-18c1-11f0-bcd6-f0a6542bbddc',1,21,'2025-04-14 01:49:21','system',NULL,NULL),(22,'ebc5acf9-18c1-11f0-bcd6-f0a6542bbddc',1,22,'2025-04-14 01:49:21','system',NULL,NULL),(23,'ebc92930-18c1-11f0-bcd6-f0a6542bbddc',1,23,'2025-04-14 01:49:21','system',NULL,NULL),(24,'ebcc9834-18c1-11f0-bcd6-f0a6542bbddc',1,24,'2025-04-14 01:49:21','system',NULL,NULL),(25,'ebd03ab4-18c1-11f0-bcd6-f0a6542bbddc',1,25,'2025-04-14 01:49:21','system',NULL,NULL),(26,'ebd42515-18c1-11f0-bcd6-f0a6542bbddc',1,26,'2025-04-14 01:49:21','system',NULL,NULL),(27,'ebd7d690-18c1-11f0-bcd6-f0a6542bbddc',1,27,'2025-04-14 01:49:21','system',NULL,NULL),(28,'ebdb6a61-18c1-11f0-bcd6-f0a6542bbddc',1,28,'2025-04-14 01:49:21','system',NULL,NULL),(29,'ebdef54f-18c1-11f0-bcd6-f0a6542bbddc',1,29,'2025-04-14 01:49:21','system',NULL,NULL),(30,'ebe29f5a-18c1-11f0-bcd6-f0a6542bbddc',1,30,'2025-04-14 01:49:21','system',NULL,NULL),(31,'ebe67302-18c1-11f0-bcd6-f0a6542bbddc',1,31,'2025-04-14 01:49:21','system',NULL,NULL),(32,'ebe9c4e3-18c1-11f0-bcd6-f0a6542bbddc',1,32,'2025-04-14 01:49:21','system',NULL,NULL),(33,'ebed6ec2-18c1-11f0-bcd6-f0a6542bbddc',1,33,'2025-04-14 01:49:21','system',NULL,NULL),(34,'ebf1767b-18c1-11f0-bcd6-f0a6542bbddc',1,34,'2025-04-14 01:49:21','system',NULL,NULL),(35,'ebf53846-18c1-11f0-bcd6-f0a6542bbddc',1,35,'2025-04-14 01:49:21','system',NULL,NULL),(36,'ebf8adc7-18c1-11f0-bcd6-f0a6542bbddc',1,36,'2025-04-14 01:49:21','system',NULL,NULL),(37,'ebfc7b16-18c1-11f0-bcd6-f0a6542bbddc',1,37,'2025-04-14 01:49:21','system',NULL,NULL),(38,'ebfff0d9-18c1-11f0-bcd6-f0a6542bbddc',1,38,'2025-04-14 01:49:21','system',NULL,NULL),(39,'ec036de6-18c1-11f0-bcd6-f0a6542bbddc',1,39,'2025-04-14 01:49:21','system',NULL,NULL),(40,'ec07025b-18c1-11f0-bcd6-f0a6542bbddc',1,40,'2025-04-14 01:49:21','system',NULL,NULL),(41,'ec0a63af-18c1-11f0-bcd6-f0a6542bbddc',1,41,'2025-04-14 01:49:21','system',NULL,NULL),(42,'ec0ddbb7-18c1-11f0-bcd6-f0a6542bbddc',1,42,'2025-04-14 01:49:21','system',NULL,NULL),(43,'ec118047-18c1-11f0-bcd6-f0a6542bbddc',1,43,'2025-04-14 01:49:21','system',NULL,NULL),(44,'ec15663d-18c1-11f0-bcd6-f0a6542bbddc',1,44,'2025-04-14 01:49:21','system',NULL,NULL),(45,'ec18fb94-18c1-11f0-bcd6-f0a6542bbddc',1,45,'2025-04-14 01:49:21','system',NULL,NULL),(46,'ec1c7ae2-18c1-11f0-bcd6-f0a6542bbddc',1,46,'2025-04-14 01:49:21','system',NULL,NULL),(47,'ec2000b3-18c1-11f0-bcd6-f0a6542bbddc',1,47,'2025-04-14 01:49:21','system',NULL,NULL),(48,'ec22e0bf-18c1-11f0-bcd6-f0a6542bbddc',1,48,'2025-04-14 01:49:21','system',NULL,NULL),(49,'3828e887-1cc5-11f0-ba63-060220af8957',1,49,'2025-04-19 02:23:02','system',NULL,NULL),(50,'3828efb4-1cc5-11f0-ba63-060220af8957',1,50,'2025-04-19 02:23:02','system',NULL,NULL),(51,'3828f092-1cc5-11f0-ba63-060220af8957',1,51,'2025-04-19 02:23:02','system',NULL,NULL),(52,'3828f12d-1cc5-11f0-ba63-060220af8957',1,52,'2025-04-19 02:23:02','system',NULL,NULL),(53,'3828f1cc-1cc5-11f0-ba63-060220af8957',1,53,'2025-04-19 02:23:02','system',NULL,NULL),(54,'3828f258-1cc5-11f0-ba63-060220af8957',1,54,'2025-04-19 02:23:02','system',NULL,NULL),(55,'798825c0-1ed6-11f0-ba63-060220af8957',1,55,'2025-04-21 17:31:35','system',NULL,NULL),(56,'79882d1d-1ed6-11f0-ba63-060220af8957',1,56,'2025-04-21 17:31:35','system',NULL,NULL),(95,'e602df57-39af-11f0-ba63-060220af8957',2,1,'2025-05-25 21:33:28',NULL,NULL,NULL),(96,'e602dfbb-39af-11f0-ba63-060220af8957',2,2,'2025-05-25 21:33:28',NULL,NULL,NULL),(97,'e602dfce-39af-11f0-ba63-060220af8957',2,3,'2025-05-25 21:33:28',NULL,NULL,NULL),(98,'e602dfe3-39af-11f0-ba63-060220af8957',2,4,'2025-05-25 21:33:28',NULL,NULL,NULL),(99,'e602dff3-39af-11f0-ba63-060220af8957',2,5,'2025-05-25 21:33:28',NULL,NULL,NULL),(100,'e602e002-39af-11f0-ba63-060220af8957',2,6,'2025-05-25 21:33:28',NULL,NULL,NULL),(101,'e602e011-39af-11f0-ba63-060220af8957',2,7,'2025-05-25 21:33:28',NULL,NULL,NULL),(102,'e602e02a-39af-11f0-ba63-060220af8957',2,8,'2025-05-25 21:33:28',NULL,NULL,NULL),(103,'e602e117-39af-11f0-ba63-060220af8957',2,9,'2025-05-25 21:33:28',NULL,NULL,NULL),(104,'e602e130-39af-11f0-ba63-060220af8957',2,10,'2025-05-25 21:33:28',NULL,NULL,NULL),(105,'e602e142-39af-11f0-ba63-060220af8957',2,11,'2025-05-25 21:33:28',NULL,NULL,NULL),(106,'e602e152-39af-11f0-ba63-060220af8957',2,12,'2025-05-25 21:33:28',NULL,NULL,NULL),(107,'e602e161-39af-11f0-ba63-060220af8957',2,13,'2025-05-25 21:33:28',NULL,NULL,NULL),(108,'e602e170-39af-11f0-ba63-060220af8957',2,14,'2025-05-25 21:33:28',NULL,NULL,NULL),(109,'e602e17f-39af-11f0-ba63-060220af8957',2,15,'2025-05-25 21:33:28',NULL,NULL,NULL),(110,'e602e18f-39af-11f0-ba63-060220af8957',2,16,'2025-05-25 21:33:28',NULL,NULL,NULL),(111,'e602e19d-39af-11f0-ba63-060220af8957',2,17,'2025-05-25 21:33:28',NULL,NULL,NULL),(112,'e602e1ad-39af-11f0-ba63-060220af8957',2,18,'2025-05-25 21:33:28',NULL,NULL,NULL),(113,'e602e1bd-39af-11f0-ba63-060220af8957',2,19,'2025-05-25 21:33:28',NULL,NULL,NULL),(114,'e602e1cd-39af-11f0-ba63-060220af8957',2,20,'2025-05-25 21:33:28',NULL,NULL,NULL),(115,'e602e1da-39af-11f0-ba63-060220af8957',2,21,'2025-05-25 21:33:28',NULL,NULL,NULL),(116,'e602e1e8-39af-11f0-ba63-060220af8957',2,22,'2025-05-25 21:33:28',NULL,NULL,NULL),(117,'e602e1f5-39af-11f0-ba63-060220af8957',2,23,'2025-05-25 21:33:28',NULL,NULL,NULL),(118,'e602e206-39af-11f0-ba63-060220af8957',2,24,'2025-05-25 21:33:28',NULL,NULL,NULL),(119,'e602e215-39af-11f0-ba63-060220af8957',2,25,'2025-05-25 21:33:28',NULL,NULL,NULL),(120,'e602e225-39af-11f0-ba63-060220af8957',2,26,'2025-05-25 21:33:28',NULL,NULL,NULL),(121,'e602e233-39af-11f0-ba63-060220af8957',2,27,'2025-05-25 21:33:28',NULL,NULL,NULL),(122,'e602e240-39af-11f0-ba63-060220af8957',2,28,'2025-05-25 21:33:28',NULL,NULL,NULL),(123,'e602e251-39af-11f0-ba63-060220af8957',2,29,'2025-05-25 21:33:28',NULL,NULL,NULL),(124,'e602e25e-39af-11f0-ba63-060220af8957',2,30,'2025-05-25 21:33:28',NULL,NULL,NULL),(125,'e602e270-39af-11f0-ba63-060220af8957',2,31,'2025-05-25 21:33:28',NULL,NULL,NULL),(126,'e602e280-39af-11f0-ba63-060220af8957',2,32,'2025-05-25 21:33:28',NULL,NULL,NULL),(127,'e602e28e-39af-11f0-ba63-060220af8957',2,33,'2025-05-25 21:33:28',NULL,NULL,NULL),(128,'e602e29e-39af-11f0-ba63-060220af8957',2,34,'2025-05-25 21:33:28',NULL,NULL,NULL),(129,'e602e2ae-39af-11f0-ba63-060220af8957',2,35,'2025-05-25 21:33:28',NULL,NULL,NULL),(130,'e602e2bd-39af-11f0-ba63-060220af8957',2,36,'2025-05-25 21:33:28',NULL,NULL,NULL),(131,'e602e2d0-39af-11f0-ba63-060220af8957',2,37,'2025-05-25 21:33:28',NULL,NULL,NULL),(132,'e602e2e2-39af-11f0-ba63-060220af8957',2,38,'2025-05-25 21:33:28',NULL,NULL,NULL),(133,'e602e2f5-39af-11f0-ba63-060220af8957',2,39,'2025-05-25 21:33:28',NULL,NULL,NULL),(134,'e602e308-39af-11f0-ba63-060220af8957',2,40,'2025-05-25 21:33:28',NULL,NULL,NULL),(135,'e602e31a-39af-11f0-ba63-060220af8957',2,41,'2025-05-25 21:33:28',NULL,NULL,NULL),(136,'e602e32c-39af-11f0-ba63-060220af8957',2,42,'2025-05-25 21:33:28',NULL,NULL,NULL),(137,'e602e3ad-39af-11f0-ba63-060220af8957',2,43,'2025-05-25 21:33:28',NULL,NULL,NULL),(138,'e602e3be-39af-11f0-ba63-060220af8957',2,44,'2025-05-25 21:33:28',NULL,NULL,NULL),(139,'e602e3d2-39af-11f0-ba63-060220af8957',2,45,'2025-05-25 21:33:28',NULL,NULL,NULL),(140,'e602e3e5-39af-11f0-ba63-060220af8957',2,46,'2025-05-25 21:33:28',NULL,NULL,NULL),(141,'e602e3f7-39af-11f0-ba63-060220af8957',2,47,'2025-05-25 21:33:28',NULL,NULL,NULL),(142,'e602e409-39af-11f0-ba63-060220af8957',2,48,'2025-05-25 21:33:28',NULL,NULL,NULL),(143,'e602e41b-39af-11f0-ba63-060220af8957',2,49,'2025-05-25 21:33:28',NULL,NULL,NULL),(144,'e602e42e-39af-11f0-ba63-060220af8957',2,50,'2025-05-25 21:33:28',NULL,NULL,NULL),(145,'e602e446-39af-11f0-ba63-060220af8957',2,51,'2025-05-25 21:33:28',NULL,NULL,NULL),(146,'e602e458-39af-11f0-ba63-060220af8957',2,52,'2025-05-25 21:33:28',NULL,NULL,NULL),(147,'e602e46a-39af-11f0-ba63-060220af8957',2,53,'2025-05-25 21:33:28',NULL,NULL,NULL),(148,'e602e47c-39af-11f0-ba63-060220af8957',2,54,'2025-05-25 21:33:28',NULL,NULL,NULL),(149,'e602e490-39af-11f0-ba63-060220af8957',2,55,'2025-05-25 21:33:28',NULL,NULL,NULL),(150,'e602e4a1-39af-11f0-ba63-060220af8957',2,56,'2025-05-25 21:33:28',NULL,NULL,NULL);
/*!40000 ALTER TABLE `roles_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `fk_role` bigint NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `username_active` varchar(255) GENERATED ALWAYS AS ((case when (`deleted` is null) then `username` else NULL end)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  UNIQUE KEY `username_active_UNIQUE` (`username_active`),
  KEY `fk_user_roles1_idx` (`fk_role`),
  CONSTRAINT `fk_role` FOREIGN KEY (`fk_role`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `uuid`, `fk_role`, `created`, `createdBy`, `deleted`, `deletedBy`) VALUES (1,'admin_user','admin@example.com','$2b$12$VGJZSRyzzKPNRapXvVpFGu7dINaCASCLhalvecda3nM5ZHX2oisHu','6a7e8bd1-18c2-11f0-bcd6-f0a6542bbddc',1,'2025-04-14 01:52:53','system',NULL,NULL),(42,'pau','misscotters@gmail.com','$2b$10$qyt8OpNmGFgT6suJRqCAbeMXAQFTYuOuIClK4Eozlj2qKVcUoWEYC','d14f5209-67e0-4724-b07e-3a6fa53c867e',2,'2025-05-25 18:58:57',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_has_places`
--

DROP TABLE IF EXISTS `users_has_places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_has_places` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `fk_user` bigint NOT NULL,
  `fk_place` bigint NOT NULL,
  `rating` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_users_has_places_places1_idx` (`fk_place`),
  KEY `fk_users_has_places_users1_idx` (`fk_user`),
  CONSTRAINT `fk_users_has_places_places1` FOREIGN KEY (`fk_place`) REFERENCES `places` (`id`),
  CONSTRAINT `fk_users_has_places_users1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_has_places`
--

LOCK TABLES `users_has_places` WRITE;
/*!40000 ALTER TABLE `users_has_places` DISABLE KEYS */;
INSERT INTO `users_has_places` VALUES (40,'772a6cc3-083b-48be-9e75-8a7b81529d4b',1,58,2,'muchos pisos con escaleras y solo dos ascensores, pero no está mal','[]','2025-05-20 22:15:50','6a7e8bd1-18c2-11f0-bcd6-f0a6542bbddc',NULL,NULL),(42,'0a67516f-9299-4e7a-aa91-e3d127bb9a0f',1,59,3,'Tiene ascensor',NULL,'2025-05-23 15:27:00','6a7e8bd1-18c2-11f0-bcd6-f0a6542bbddc',NULL,NULL),(43,'3255aef1-160c-4765-8455-8671cdfd5e49',1,59,3,'Muy amplio','[]','2025-05-27 00:59:03','6a7e8bd1-18c2-11f0-bcd6-f0a6542bbddc',NULL,NULL);
/*!40000 ALTER TABLE `users_has_places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'dbmaster'
--

--
-- Dumping routines for database 'dbmaster'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 15:25:54
