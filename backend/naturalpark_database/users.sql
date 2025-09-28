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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `birth_date` date NOT NULL,
  `phone_no` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','guide','visitor') NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `profile_image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `gender`, `birth_date`, `phone_no`, `created_at`, `name`, `email`, `password`, `role`, `approved`, `profile_image_url`) VALUES
(3, 'male', '2004-06-02', '0124365798', '2025-04-17 13:08:03', 'Frankie Ling', 'frankieling123@gmail.com', '123', 'guide', 1, '/uploads/profiles/profile_1746665838014.jpeg'),
(4, 'male', '1990-05-15', '123456789', '2025-04-27 10:03:45', 'John Smith', 'john.guide@example.com', '$2a$10$examplehash', 'guide', 1, NULL),
(5, 'female', '1992-08-22', '123456790', '2025-04-27 10:04:19', 'Sarah Johnson', 'sarah.guide@example.com', '$2a$10$examplehash', 'guide', 1, NULL),
(6, 'male', '1988-03-10', '123456791', '2025-04-27 10:04:19', 'Michael Brown', 'mike.guide@example.com', '$2a$10$examplehash', 'guide', 1, NULL),
(7, 'female', '1991-11-05', '123456792', '2025-04-27 10:04:19', 'Emily Davis', 'emily.guide@example.com', '$2a$10$examplehash', 'guide', 1, NULL),
(8, 'male', '1989-07-18', '123456793', '2025-04-27 10:04:19', 'David Wilson', 'david.guide@example.com', '$2a$10$examplehash', 'guide', 1, NULL),
(9, 'male', '2016-05-03', '0123456789', '2025-05-03 06:33:03', 'Dena', 'fran123@gmail.com', '123456', 'visitor', 1, NULL),
(10, 'male', '2025-05-07', '0128542801', '2025-05-10 07:18:10', 'Islam Mamedov', 'islammamedov@gmail.com', '$2b$10$lsurkHNUaDZn/6meDaPhAerryfTjxK54vRDmXNj8.dR8Sq.cOWmRK', 'visitor', 1, NULL),
(11, 'male', '2025-05-07', '0128542801', '2025-05-10 07:18:10', 'A', 'a@gmail.com', '$2b$10$mB8quT1CD33SRKvJCUufIu1KvKWwop5HJ84HwgxDFwZSNNC612nae', 'visitor', 1, NULL),
(12, 'male', '2009-04-08', '0128548011', '2025-05-10 07:18:10', 'Frankie', 'frankie@gmail.com', '$2b$10$hp2mFnvj4NwJvW3ckT3Da.eQTK4t6Ry4mHnbI.CS4I1LUUpXkDRSu', 'guide', 1, NULL),
(13, 'male', '2004-08-13', '0128542801', '2025-05-10 07:18:10', 'Islam Mamedov', 'islammamedov132004@gmail.com', '$2b$10$QDf7obhKEgUJT5gPv396EuYpxVQETmalTunFtdxM0JUqw3Xdgszl6', 'guide', 1, NULL),
(14, 'male', '2004-05-21', '0123456789', '2025-05-10 08:59:44', 'Thom', 'thomas123@gmail.com', '$2b$10$KRz64UqVJ175urj07keDrOcspOASyBrulfDjtx1NdRSr3TYreHjYi', 'visitor', 1, NULL),
(15, 'male', '1990-01-01', '1234567890', '2025-05-10 12:36:52', 'Admin', 'admin@gmail.com', '$2b$10$zDvqoYTV6F6F4CjPKsFsuujsukzSLbFuZugCLfPHI3rdGSi/cOTgO', 'admin', 1, NULL),
(16, 'male', '1999-05-12', '9146238765', '2025-05-12 05:56:47', 'Java', 'java@gmail.com', '$2b$10$crGMdkWVPzR/vUAeNKvMZ.CFIcFjHx2L77crhi.q/eG/j.Jn4DFfa', 'guide', 1, NULL),
(17, 'female', '2000-05-12', '0123456789', '2025-05-12 06:05:30', 'c', 'c@gmail.com', '$2b$10$gI1fRC4jcqAvJVVOvTgkSe9soR6i5JK0M823QotiQcn/Y.XdIw.7a', 'guide', 1, NULL),
(18, 'male', '2025-05-14', '0123456789', '2025-05-14 00:10:25', 'Ash', 'ash@gmail.com', '$2b$10$WsJYBME97Yz1lo3Jlkx9wOeUMHq/F6yXwIa.eFvkQzU.u8Cj9gD/W', 'guide', 1, NULL),
(19, 'female', '2025-05-15', '01126223450', '2025-05-15 14:36:30', 'New', 'new@gmail.com', '$2b$10$Ux7BR1t99ncrAPKWb0vGBeno925dG2h0Tle/8kV3ea9Xs4nJfeG5y', 'guide', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
