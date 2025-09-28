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
-- Table structure for table `coursehistory`
--

CREATE TABLE `coursehistory` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `courseId` text NOT NULL,
  `courseTitle` text NOT NULL,
  `result` text NOT NULL,
  `certificate` text,
  `completedAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `coursehistory`
--

INSERT INTO `coursehistory` (`id`, `user_id`, `courseId`, `courseTitle`, `result`, `certificate`, `completedAt`) VALUES
(1, 17, '1747150740630', 'Love Yourself', 'Failed', NULL, '2025-05-14 01:23:16'),
(2, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 01:23:32'),
(3, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 10:48:00'),
(4, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 10:48:27'),
(5, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 10:49:20'),
(6, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 11:47:15'),
(7, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 11:49:18'),
(8, 17, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 11:50:52'),
(9, 17, '1747196696083', 'Hello', 'Failed', NULL, '2025-05-14 12:27:52'),
(10, 12, '1747196696083', 'Hello', 'Passed', 'Certificate for Hello', '2025-05-14 15:23:41'),
(11, 17, '1747196696083', 'Hello', 'Passed', 'Certificate for Hello', '2025-05-14 17:55:33'),
(12, 17, '1747213107500', 'Let see', 'Passed', 'Certificate for Let see', '2025-05-14 17:57:09'),
(13, 17, '1747150950787', 'GO', 'Passed', 'Certificate for GO', '2025-05-14 18:06:54'),
(14, 12, '1747213107500', 'Let see', 'Passed', 'Certificate for Let see', '2025-05-14 18:16:17'),
(15, 12, '1747150950787', 'GO', 'Passed', 'Certificate for GO', '2025-05-14 18:18:16'),
(16, 12, '1747212829914', 'Course Test', 'Failed', NULL, '2025-05-14 18:19:38'),
(17, 12, '1747212829914', 'Course Test', 'Failed', NULL, '2025-05-14 18:19:40'),
(18, 12, '1747212829914', 'Course Test', 'Failed', NULL, '2025-05-14 18:20:08'),
(19, 12, '1747212437501', 'Introduction to Wildlife', 'Failed', NULL, '2025-05-14 18:20:19'),
(20, 12, '1747212437501', 'Introduction to Wildlife', 'Passed', 'Certificate for Introduction to Wildlife', '2025-05-14 18:20:30'),
(21, 17, '1747212829914', 'Course Test', 'Passed', 'Certificate for Course Test', '2025-05-14 21:22:30'),
(22, 17, '1747213632079', '2', 'Failed', NULL, '2025-05-14 21:28:34'),
(23, 17, '1747213632079', '2', 'Passed', 'Certificate for 2', '2025-05-14 21:29:16'),
(24, 17, '1747212437501', 'Introduction to Wildlife', 'Passed', 'Certificate for Introduction to Wildlife', '2025-05-14 21:53:33'),
(25, 12, '1747150740630', 'Love Yourself', 'Passed', 'Certificate for Love Yourself', '2025-05-14 22:09:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `coursehistory`
--
ALTER TABLE `coursehistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coursehistory`
--
ALTER TABLE `coursehistory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coursehistory`
--
ALTER TABLE `coursehistory`
  ADD CONSTRAINT `coursehistory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
