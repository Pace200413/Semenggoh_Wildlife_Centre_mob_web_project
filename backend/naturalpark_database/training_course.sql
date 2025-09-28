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
-- Table structure for table `training_course`
--

CREATE TABLE `training_course` (
  `course_id` int NOT NULL,
  `course_title` varchar(255) DEFAULT NULL,
  `course_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `training_course`
--

INSERT INTO `training_course` (`course_id`, `course_title`, `course_data`, `created_at`) VALUES
(1, 'Advanced Eco-Tourism Training', '{\"media\": null, \"modules\": [{\"uri\": \"\", \"url\": \"\", \"type\": \"media\", \"title\": \"\", \"content\": \"\"}], \"hyperlinks\": [], \"courseLevel\": \"Intermediate\", \"coursePrice\": \"Free\", \"courseTitle\": \"Advanced Eco-Tourism Training\", \"courseDuration\": \"4 weeks\", \"courseDescription\": \"Excellent communication, suggested for leadership role.\"}', '2025-05-09 04:24:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `training_course`
--
ALTER TABLE `training_course`
  ADD PRIMARY KEY (`course_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `training_course`
--
ALTER TABLE `training_course`
  MODIFY `course_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
