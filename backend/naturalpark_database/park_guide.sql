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
-- Table structure for table `park_guide`
--

CREATE TABLE `park_guide` (
  `guide_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` float NOT NULL DEFAULT '5'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `park_guide`
--

INSERT INTO `park_guide` (`guide_id`, `user_id`, `rating`) VALUES
(1, 8, 4),
(2, 7, 5),
(3, 4, 3),
(4, 6, 5),
(5, 5, 1.2),
(6, 17, 5),
(7, 12, 5),
(8, 18, 5),
(9, 19, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `park_guide`
--
ALTER TABLE `park_guide`
  ADD PRIMARY KEY (`guide_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `park_guide`
--
ALTER TABLE `park_guide`
  MODIFY `guide_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `park_guide`
--
ALTER TABLE `park_guide`
  ADD CONSTRAINT `park_guide_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
