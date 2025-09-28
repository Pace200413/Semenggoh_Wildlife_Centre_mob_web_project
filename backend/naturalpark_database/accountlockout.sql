-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2025 at 09:42 AM
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
-- Table structure for table `accountlockout`
--

CREATE TABLE `accountlockout` (
  `id` bigint NOT NULL,
  `user_id` int DEFAULT NULL,
  `failed_attempts` int DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `unlock_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accountlockout`
--

INSERT INTO `accountlockout` (`id`, `user_id`, `failed_attempts`, `locked_at`, `unlock_at`) VALUES
(3, 2, 5, '2025-05-09 15:47:57', '2025-05-09 16:02:57'),
(4, 3, 5, '2025-05-09 15:49:30', '2025-05-09 16:04:30'),
(5, 9, 5, '2025-05-10 20:17:45', '2025-05-10 20:32:45'),
(6, 18, 5, '2025-05-14 08:14:53', '2025-05-14 08:29:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountlockout`
--
ALTER TABLE `accountlockout`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accountlockout`
--
ALTER TABLE `accountlockout`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
