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
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int NOT NULL,
  `user_id` int NOT NULL,
  `guide_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` enum('10:00:00','14:00:00') NOT NULL,
  `adult_count` int NOT NULL,
  `child_count` int DEFAULT NULL,
  `emergency_contact_name` text NOT NULL,
  `emergency_contact_no` varchar(15) NOT NULL,
  `remark` text,
  `status` enum('pending','confirmed','cancelled','completed','commented') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `payment_method` enum('online','cash') NOT NULL DEFAULT 'online',
  `price` int NOT NULL DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `user_id`, `guide_id`, `booking_date`, `booking_time`, `adult_count`, `child_count`, `emergency_contact_name`, `emergency_contact_no`, `remark`, `status`, `payment_method`, `price`) VALUES
(1, 3, 3, '2025-04-28', '10:00:00', 2, 0, 'Gura', '01122334455', '', 'pending', 'online', 10),
(2, 3, 3, '2025-04-30', '14:00:00', 2, 0, 'Frank', '123456798', '', 'pending', 'online', 10),
(3, 3, 3, '2025-04-28', '10:00:00', 2, 0, 'fra', '564312798', '', 'pending', 'online', 10),
(4, 14, 3, '2025-05-08', '10:00:00', 1, 1, 'kuak', '1025487693', '', 'pending', 'online', 10),
(6, 14, 3, '2025-05-13', '10:00:00', 2, 1, 'Huhaa', '0124375968', 'asdsd', 'pending', 'online', 10),
(7, 14, 3, '2025-05-14', '14:00:00', 1, 1, 'Err', '1234567890', '\nCancelled: Health problems', 'cancelled', 'online', 10),
(8, 14, 5, '2025-05-09', '14:00:00', 3, 3, 'Rttt', '530871426', '', 'commented', 'online', 10),
(9, 14, 5, '2025-05-09', '14:00:00', 2, 1, 'Tyy', '5556669990', '', 'completed', 'online', 10),
(10, 14, 3, '2025-05-15', '10:00:00', 2, 1, 'asda', '012547963', '', 'pending', 'online', 10),
(11, 14, 3, '2025-05-13', '14:00:00', 2, 2, 'Ssd', '5558882221', '', 'cancelled', 'online', 10),
(12, 14, 3, '2025-05-05', '10:00:00', 2, 2, 'as', '233355', '', 'pending', 'online', 10),
(15, 14, 3, '2025-05-06', '10:00:00', 2, 0, 'Dd', '5544118877', '', 'pending', 'online', 10),
(16, 14, 3, '2025-05-06', '14:00:00', 2, 1, 'Rrr', '158074622', '', 'pending', 'online', 10),
(17, 14, 4, '2025-05-06', '14:00:00', 2, 0, 'Ser', '0123456789', '', 'pending', 'online', 10),
(18, 14, 2, '2025-05-22', '10:00:00', 2, 1, 'James', '0123456789', '', 'pending', 'online', 10),
(19, 14, 2, '2025-05-21', '10:00:00', 2, 1, 'James', '0123456789', '', 'pending', 'online', 12),
(20, 14, 6, '2025-05-20', '10:00:00', 2, 1, 'James', '0123456789', '\nCancelled: Change of plans', 'cancelled', 'online', 12),
(21, 14, 6, '2025-05-21', '14:00:00', 2, 4, 'Thomas', '0123456789', '', 'confirmed', 'online', 18),
(22, 14, 6, '2025-05-14', '10:00:00', 2, 0, 'James', '0123456789', '', 'commented', 'online', 10),
(23, 14, 6, '2025-05-22', '10:00:00', 1, 2, 'Jee', '0123456789', '', 'pending', 'online', 9),
(24, 14, 6, '2025-05-13', '10:00:00', 1, 2, 'Thomas', '0123456789', '', 'completed', 'online', 9),
(25, 14, 6, '2025-05-23', '14:00:00', 1, 0, 'Jee', '0123456789', '', 'pending', 'online', 5),
(26, 14, 6, '2025-05-23', '10:00:00', 1, 1, 'Jee', '55667788990', '', 'pending', 'online', 7),
(28, 14, 6, '2025-05-23', '10:00:00', 1, 2, 'hihi', '0123456789', '', 'pending', 'online', 9),
(29, 14, 6, '2025-05-23', '14:00:00', 3, 0, 'James', '0123456765', '', 'pending', 'online', 15),
(31, 14, 6, '2025-05-19', '10:00:00', 2, 1, 'homas', '0123456789', '', 'pending', 'online', 12),
(32, 14, 6, '2025-05-19', '10:00:00', 1, 1, 'noo', '1234567899', '', 'pending', 'online', 7),
(33, 14, 6, '2025-05-19', '14:00:00', 1, 1, 'haiya', '0123456679', '', 'pending', 'online', 7),
(34, 14, 6, '2025-05-19', '14:00:00', 1, 1, 'test', '1122334455', '', 'pending', 'online', 7),
(35, 14, 6, '2025-05-20', '10:00:00', 1, 1, 'try', '0123456789', '', 'pending', 'online', 7),
(36, 14, 6, '2025-05-22', '14:00:00', 1, 1, 'daa', '1122335566', '', 'pending', 'online', 7),
(37, 14, 6, '2025-05-22', '14:00:00', 1, 1, 'hi', 'noo', '', 'pending', 'online', 7),
(38, 14, 6, '2025-05-24', '14:00:00', 1, 1, 'thomas', '0123456789', '', 'pending', 'online', 7),
(39, 14, 6, '2025-05-24', '14:00:00', 1, 1, 'ssdf', '12334566712', '', 'pending', 'online', 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `guide_id` (`guide_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `park_guide` (`guide_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
