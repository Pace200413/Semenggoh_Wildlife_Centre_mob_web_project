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
-- Table structure for table `guidecoursestatus`
--

CREATE TABLE `guidecoursestatus` (
  `id` int NOT NULL,
  `guide_id` int NOT NULL,
  `courseId` varchar(30) NOT NULL,
  `status` text NOT NULL,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `guidecoursestatus`
--

INSERT INTO `guidecoursestatus` (`id`, `guide_id`, `courseId`, `status`, `updatedAt`) VALUES
(1, 6, '1747150740630', 'completed', '2025-05-14 11:50:52'),
(3, 6, '1747196696083', 'completed', '2025-05-14 17:55:33'),
(4, 7, '1747196696083', 'completed', '2025-05-14 15:23:41'),
(7, 6, '1747213107500', 'completed', '2025-05-14 17:57:09'),
(9, 6, '1747150950787', 'completed', '2025-05-14 18:06:54'),
(11, 7, '1747213107500', 'completed', '2025-05-14 18:16:17'),
(13, 7, '1747150740630', 'completed', '2025-05-14 22:09:22'),
(14, 7, '1747150950787', 'completed', '2025-05-14 18:18:16'),
(16, 7, '1747212829914', 'enrolled', '2025-05-14 18:19:34'),
(17, 7, '1747212437501', 'completed', '2025-05-14 18:20:30'),
(19, 6, '1747212829914', 'completed', '2025-05-14 21:22:30'),
(21, 6, '1747213632079', 'completed', '2025-05-14 21:29:16'),
(23, 6, '1747212437501', 'completed', '2025-05-14 21:53:33'),
(26, 3, '1747196696083', 'enrolled', '2025-05-15 20:24:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guidecoursestatus`
--
ALTER TABLE `guidecoursestatus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guide_id` (`guide_id`,`courseId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guidecoursestatus`
--
ALTER TABLE `guidecoursestatus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guidecoursestatus`
--
ALTER TABLE `guidecoursestatus`
  ADD CONSTRAINT `guidecoursestatus_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `park_guide` (`guide_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
