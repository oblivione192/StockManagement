-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: stockdev2
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ownership`
--

DROP TABLE IF EXISTS `ownership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ownership` (
  `user_id` bigint DEFAULT NULL,
  `product_id` varchar(16) DEFAULT NULL,
  `ownership_date` date DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  KEY `ownership_ibfk_2` (`user_id`),
  KEY `ownership_product_fk` (`product_id`),
  CONSTRAINT `ownership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `ownership_product_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ownership`
--

LOCK TABLES `ownership` WRITE;
/*!40000 ALTER TABLE `ownership` DISABLE KEYS */;
INSERT INTO `ownership` VALUES (19,'T600','2010-02-02',13),(19,'Y1239D','2024-10-11',25),(19,'PRS-1100','2022-10-04',17);
/*!40000 ALTER TABLE `ownership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` varchar(16) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `product_discontinued` tinyint(1) DEFAULT NULL,
  `product_description` json NOT NULL,
  `product_brand` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('PRS-1100','Pensonic 1 Door Refrigerator 110L ',1999.99,'Refrigerator',0,'{\"image_path\": \"user_assets/pensonic-refrigerator.jpg\", \"description\": \"Voltage             : 220- 240V                             Frequency         : 50Hz Current              : 0.5A Capacity           : Net: 90L (81+9)  Gross: 110L\", \"product_image\": \"user_assets/pensonic-refrigerator.jpg\"}','Pensonic','user_assets/pensonic-refrigerator.jpg'),('T600','Samsung OLED Odyssey',1900.00,'TV',0,'{\"description\": \"screen_size:27, resolution: 4K UHD, smart_tv= YES\"}','Samsung','/user_assets/my-odyssey-oled-g6-g61sd-ls27dg610sexxs-544108085.avif'),('Y1239D','Ghostface Plushie',60.00,'Toy',0,'{\"description\": \"Yellow ghostface plushie. \"}','Unknown','/user_assets/ghostfxce.png');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testtable`
--

DROP TABLE IF EXISTS `testtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testtable` (
  `product_id` varchar(255) DEFAULT NULL,
  `product_description` json NOT NULL,
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testtable`
--

LOCK TABLES `testtable` WRITE;
/*!40000 ALTER TABLE `testtable` DISABLE KEYS */;
/*!40000 ALTER TABLE `testtable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'eugene_16','1433abc3da','yujinghew43@gmail.com'),(2,'harith','$2b$06$DpKT05VB4jhowjGGIKNchuroJjc0r71kLJeqeceuVRiI39GAi6jQ.','realme5@gmail.com'),(3,'xisi','$2b$06$dAZhIYNb7t9IFYGPcYjQW.iEQYiSMrji9/2TVjeSROtrOCLQ9Pefu','mysql@gmail.com'),(4,'Debian','$2b$06$Kg/W3Eil3m.SOCep1rna.O5fl8UiWPdFdGw1JARcw0XugDc8aalzG','debian1@gmail.com'),(6,'sha123','$2b$06$MCSYE27Id3D1uUtMr8npYubzT2AchNNhk0QVxYzo2UFJFnLzVy8.e','sha123@gmail.com'),(7,'songmin','$2b$06$Mn12w1ycCTJKTJJt.lfLRuY0CF0Wqp1AzjG.G6eKnBpphJm5mfrr.','song@gmail.com'),(8,'shok','$2b$06$w3vgbrDtpEUO0.eG8sXR3.PTrrrZXsyPwBjdlMVv2yPB5TvCralKC','thunderbird@gmail.com'),(9,'shok','$2b$06$V94poWk9vipV4B3N3C.kPefaq3fxxRnJ65M9d5A2qrk8pdR6GJap6','thunderbird@gmail.com'),(19,'hue','$2b$06$FAyTrvEKGOe5vW.MdFHc9.H.L/YANtwCePQXukIz7HVd0Gj/j4DWu','yujinghew43@1utar.my'),(20,'rem','$2b$06$T8ceNmeltDcHpnLXI72EMOpnnHUqPOI9UB0stEZMlE3mRwTjiSVw6','rem@gmail.com'),(21,'Newuser','$2b$06$ftZf07tNbudUnrsHkD394uoxoIDNUerTLfuJjwm27EbZguUoQPMDy','dabdabfireburnt@gmail.com'),(22,'hello','$2b$06$LfVBbgwib6KexbN3QgcuaeKmrwS.peN3hlamIRx7lA2IwapnAFRXO','ryiuk@gmail.com'),(23,'breah','$2b$06$sjaWZJD1QVpMup71cCOtNeoNQVMXJC3X/7dsPvgPkKwmrVYM/LVUu','dabdabrussell@gmail.com'),(24,'chicken','$2b$06$nUnL13in3EL0IgNmf.XPFOJc6h6E5ku94vdOhGwd4axVFdtgVMk2K','dabdabrussell@gmail.com'),(25,'chim','$2b$06$CMK.LhiQK12Kys5WrktVcuyN8wI5Sa1RMAfNYKqW2mF79RSYYbCIi','chims1@gmail.com'),(26,'chim1','$2b$06$GF4JK2l.nlNeLbcAcapbROMsDX0vgks04Kv0VW2jBZdwxKJEfSS1.','chims1@gmail.com'),(27,'shok123','$2b$06$j8xL346PezUMcsz.W05hieKfVWohyCxLLa.x2YjBua6KRWc8viuju','shok123@gmail.com'),(28,'baby','$2b$06$NwlmXn0FnXRzjbd2DhKTP.HysO8T5m7uKgnnZEqbXZqJyKzKmhj0W','ryiuk@gmail.com'),(29,'stark','$2b$06$c5yT3XkOAd842PDiPza0QutsNedb8vEQ8xFMf7ibOmMw/mapfTxoG','stark11@gmail.com'),(30,'sharp12','$2b$06$uo7wngCU/kWChC/4xze60OjSZzboa2k8hNQ7Fu0G9XHeZxcyk25mK','yujinghew43@1utar.my'),(31,'sharp13','$2b$06$M8rZbKav.r2Dbc3WnpUkY.zXenYXmoJkMC6WMKjZvrIjqicHgQRgC','yujinghew43@1utar.my'),(32,'host','$2b$06$WSglUuomfwt0NNZgEpukJeOcTaugPQVtPeqtv3Sr5rJEzNEf.c0b2','dabdabfireburnt@gmail.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-08 16:51:18
