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
-- Table structure for table `identification_results`
--

CREATE TABLE `identification_results` (
  `result_id` int NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `predicted_plant` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `identification_results`
--

INSERT INTO `identification_results` (`result_id`, `image_path`, `predicted_plant`, `created_at`) VALUES
(1, '/C:/Users/User/Documents/Degree Y2 S2/COS30049 Computing Technology Innovation Project/Project/backend/uploads/plants/1746689640492.jpg', 'Mercurialis_annua', '2025-05-08 07:34:05'),
(2, '/C:/Users/User/Documents/Degree Y2 S2/COS30049 Computing Technology Innovation Project/Project/backend/uploads/plants/1746689844737.jpg', 'Mercurialis_annua', '2025-05-08 07:37:30'),
(3, '/uploads/plants/1746691163967.jpg', 'Pelargonium_capitatum', '2025-05-08 07:59:28'),
(4, '/uploads/plants/1746763837068.jpg', 'Mercurialis_annua', '2025-05-09 04:10:59'),
(5, '/uploads/plants/1746892388737.jpg', 'Mercurialis_annua', '2025-05-10 15:53:18'),
(6, '/uploads/plants/1747292582021.jpg', 'Mercurialis_annua', '2025-05-15 07:03:11'),
(7, '/uploads/plants/1747328247277.jpg', 'Mercurialis_annua', '2025-05-15 16:57:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `identification_results`
--
ALTER TABLE `identification_results`
  ADD PRIMARY KEY (`result_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `identification_results`
--
ALTER TABLE `identification_results`
  MODIFY `result_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
