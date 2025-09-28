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
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `certificateId` int NOT NULL,
  `certificateName` text NOT NULL,
  `courseId` varchar(100) NOT NULL,
  `courseTitle` text NOT NULL,
  `requiredForLicense` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`certificateId`, `certificateName`, `courseId`, `courseTitle`, `requiredForLicense`) VALUES
(1, 'Certificate for Love Yourself', '1747150740630', 'Love Yourself', 'Senior Guide'),
(2, 'Certificate for GO', '1747150950787', 'GO', 'Senior Guide'),
(3, 'Certificate for Hello', '1747196696083', 'Hello', 'Junior Guide'),
(4, 'Certificate for Introduction to Wildlife', '1747212437501', 'Introduction to Wildlife', 'Master'),
(5, 'Certificate for Course Test', '1747212829914', 'Course Test', 'Master'),
(6, 'Certificate for Let see', '1747213107500', 'Let see', 'Junior Guide'),
(7, 'Certificate for 2', '1747213632079', '2', 'Master');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`certificateId`),
  ADD UNIQUE KEY `courseId` (`courseId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `certificateId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
