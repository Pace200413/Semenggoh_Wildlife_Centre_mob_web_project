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
-- Table structure for table `securityincident`
--

CREATE TABLE `securityincident` (
  `id` bigint NOT NULL,
  `category` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `severity` enum('Low','Medium','High','Critical') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detected_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `securityincident`
--

INSERT INTO `securityincident` (`id`, `category`, `severity`, `detected_at`) VALUES
(1, 'brute force attack', 'High', '2025-05-07 16:23:46'),
(2, 'brute force attack', 'High', '2025-05-08 13:44:25'),
(3, 'brute force attack', 'High', '2025-05-09 15:47:57'),
(4, 'brute force attack', 'High', '2025-05-09 15:49:30'),
(5, 'brute force attack', 'High', '2025-05-10 20:17:45'),
(6, 'brute force attack', 'High', '2025-05-14 08:14:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `securityincident`
--
ALTER TABLE `securityincident`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `securityincident`
--
ALTER TABLE `securityincident`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
