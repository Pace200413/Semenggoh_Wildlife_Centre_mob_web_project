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
-- Table structure for table `guidelicenses`
--

CREATE TABLE `guidelicenses` (
  `id` int NOT NULL,
  `guide_id` int NOT NULL,
  `licenseId` int NOT NULL,
  `park_id` int NOT NULL,
  `earnedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','earned') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `requestedAt` datetime DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guidelicenses`
--

INSERT INTO `guidelicenses` (`id`, `guide_id`, `licenseId`, `park_id`, `earnedAt`, `status`, `requestedAt`, `approvedAt`, `expiry_date`) VALUES
(2, 7, 1, 2, '2025-05-14 18:27:59', 'earned', '2025-05-14 18:27:59', '2025-05-14 21:05:46', '2027-05-14'),
(3, 6, 1, 3, '2025-05-14 21:22:45', 'earned', '2025-05-14 21:22:45', '2025-05-15 01:25:00', '2025-05-21'),
(5, 6, 2, 3, '2025-05-14 21:55:23', 'pending', '2025-05-14 21:55:23', NULL, NULL),
(6, 7, 1, 1, '2025-05-14 22:09:31', 'pending', '2025-05-14 22:09:31', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guidelicenses`
--
ALTER TABLE `guidelicenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guide_id` (`guide_id`,`licenseId`,`park_id`),
  ADD KEY `licenseId` (`licenseId`),
  ADD KEY `park_id` (`park_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guidelicenses`
--
ALTER TABLE `guidelicenses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guidelicenses`
--
ALTER TABLE `guidelicenses`
  ADD CONSTRAINT `guidelicenses_ibfk_1` FOREIGN KEY (`licenseId`) REFERENCES `licenses` (`licenseId`),
  ADD CONSTRAINT `guidelicenses_ibfk_2` FOREIGN KEY (`guide_id`) REFERENCES `park_guide` (`guide_id`),
  ADD CONSTRAINT `guidelicenses_ibfk_3` FOREIGN KEY (`park_id`) REFERENCES `national_park` (`park_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
