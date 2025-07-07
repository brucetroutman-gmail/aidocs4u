-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: scoredResponses
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

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
-- Temporary view structure for view `PC_Testid_Score_Time_Model`
--

DROP TABLE IF EXISTS `PC_Testid_Score_Time_Model`;
/*!50001 DROP VIEW IF EXISTS `PC_Testid_Score_Time_Model`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `PC_Testid_Score_Time_Model` AS SELECT 
 1 AS `PCode`,
 1 AS `TestId`,
 1 AS `weightedScore`,
 1 AS `wscore`,
 1 AS `Duration`,
 1 AS `ModelName`,
 1 AS `ResponseJSON`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scores` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TestId` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PCode` char(6) DEFAULT NULL,
  `ModelName` char(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ContextSize` int DEFAULT NULL,
  `Temperature` float DEFAULT NULL,
  `CreatedAt` char(19) DEFAULT NULL,
  `Accurate` int DEFAULT NULL,
  `Relevant` int DEFAULT NULL,
  `Organized` int DEFAULT NULL,
  `WeightedScore` int DEFAULT NULL,
  `Duration` float DEFAULT NULL,
  `PromptEvalTokens` int DEFAULT NULL,
  `EvalTokens` int DEFAULT NULL,
  `EvalDuration` float DEFAULT NULL,
  `TokensPerSecond` float DEFAULT NULL,
  `ResponseFile` char(255) DEFAULT NULL,
  `ResponseJSON` longblob,
  `ResponseTEXT` longblob,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RunKey` (`CreatedAt`,`TestId`,`PCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `scores_duration`
--

DROP TABLE IF EXISTS `scores_duration`;
/*!50001 DROP VIEW IF EXISTS `scores_duration`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `scores_duration` AS SELECT 
 1 AS `responseFileName`,
 1 AS `totalDuration`,
 1 AS `modelName`,
 1 AS `pc_no`,
 1 AS `totalScore`,
 1 AS `weightedScore`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `PC_Testid_Score_Time_Model`
--

/*!50001 DROP VIEW IF EXISTS `PC_Testid_Score_Time_Model`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`nimdas`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `PC_Testid_Score_Time_Model` AS select `scores`.`PCode` AS `PCode`,`scores`.`TestId` AS `TestId`,`scores`.`WeightedScore` AS `weightedScore`,round((100 * (`scores`.`WeightedScore` / 30)),1) AS `wscore`,`scores`.`Duration` AS `Duration`,`scores`.`ModelName` AS `ModelName`,`scores`.`ResponseJSON` AS `ResponseJSON` from `scores` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `PC_Testid_Score_Time_Model_byRAM`
--

/*!50001 DROP VIEW IF EXISTS `PC_Testid_Score_Time_Model_byRAM`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`nimdas`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `PC_Testid_Score_Time_Model_byRAM` AS select `scores`.`PCode` AS `PCode`,`scores`.`TestId` AS `TestId`,lpad(format((100 * (`scores`.`WeightedScore` / 30)),2),10,' ') AS `wscore`,lpad(format(`scores`.`Duration`,2),10,' ') AS `Duration`,`scores`.`ModelName` AS `ModelName` from `scores` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `scores_duration`
--

/*!50001 DROP VIEW IF EXISTS `scores_duration`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`nimdas`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `scores_duration` AS select `scores`.`ResponseFile` AS `responseFileName`,`scores`.`Duration` AS `totalDuration`,`scores`.`ModelName` AS `modelName`,`scores`.`PCode` AS `pc_no`,((`scores`.`Accurate` + `scores`.`Relevant`) + `scores`.`Organized`) AS `totalScore`,`scores`.`WeightedScore` AS `weightedScore` from `scores` order by `scores`.`ResponseFile`,`scores`.`Duration` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-07 12:31:44
