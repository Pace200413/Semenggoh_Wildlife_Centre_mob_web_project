-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2025 at 09:44 AM
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
-- Table structure for table `licenserequirements`
--

CREATE TABLE `licenserequirements` (
  `id` int NOT NULL,
  `licenseId` int DEFAULT NULL,
  `certificateId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `licenserequirements`
--

INSERT INTO `licenserequirements` (`id`, `licenseId`, `certificateId`) VALUES
(1, 1, 3),
(2, 2, 2),
(3, 2, 1),
(7, 3, 7),
(8, 3, 4),
(9, 3, 5),
(10, 1, 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `licenserequirements`
--
ALTER TABLE `licenserequirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `licenseId` (`licenseId`),
  ADD KEY `certificateId` (`certificateId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `licenserequirements`
--
ALTER TABLE `licenserequirements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `licenserequirements`
--
ALTER TABLE `licenserequirements`
  ADD CONSTRAINT `licenserequirements_ibfk_1` FOREIGN KEY (`licenseId`) REFERENCES `licenses` (`licenseId`),
  ADD CONSTRAINT `licenserequirements_ibfk_2` FOREIGN KEY (`certificateId`) REFERENCES `certificates` (`certificateId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
