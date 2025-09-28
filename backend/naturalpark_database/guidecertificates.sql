-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2025 at 09:43 AM
-- Server version: 8.0.39
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `naturalpark_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `guidecertificates`
--

CREATE TABLE `guidecertificates` (
  `id` int NOT NULL,
  `guide_id` int NOT NULL,
  `certificateId` int DEFAULT NULL,
  `earnedAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guidecertificates`
--

INSERT INTO `guidecertificates` (`id`, `guide_id`, `certificateId`, `earnedAt`) VALUES
(1, 6, 1, '2025-05-14 17:54:23'),
(2, 6, 3, '2025-05-14 17:54:23'),
(4, 6, 6, '2025-05-14 17:57:09'),
(5, 6, 2, '2025-05-14 18:06:54'),
(6, 7, 3, '2025-05-14 18:15:39'),
(7, 7, 6, '2025-05-14 18:16:17'),
(8, 7, 2, '2025-05-14 18:18:16'),
(9, 7, 4, '2025-05-14 18:20:30'),
(10, 6, 5, '2025-05-14 21:22:30'),
(11, 6, 7, '2025-05-14 21:29:16'),
(12, 6, 4, '2025-05-14 21:53:33'),
(13, 7, 1, '2025-05-14 22:09:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guidecertificates`
--
ALTER TABLE `guidecertificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guide_id` (`guide_id`,`certificateId`),
  ADD KEY `certificateId` (`certificateId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guidecertificates`
--
ALTER TABLE `guidecertificates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guidecertificates`
--
ALTER TABLE `guidecertificates`
  ADD CONSTRAINT `guidecertificates_ibfk_1` FOREIGN KEY (`certificateId`) REFERENCES `certificates` (`certificateId`),
  ADD CONSTRAINT `guidecertificates_ibfk_2` FOREIGN KEY (`guide_id`) REFERENCES `park_guide` (`guide_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
