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
-- Table structure for table `guidenotifications`
--

CREATE TABLE `guidenotifications` (
  `id` bigint UNSIGNED NOT NULL,
  `type` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sender` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `recipient` varchar(100) NOT NULL,
  `subject` text,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guidenotifications`
--

INSERT INTO `guidenotifications` (`id`, `type`, `date`, `sender`, `recipient`, `subject`, `message`) VALUES
(1, 'Message', '2025-05-13 07:41:01', 'Admin', '6', 'Welcome', 'Welcome to the new notification system!'),
(2, 'License Expiry', '2025-05-13 07:41:01', 'System', '6', NULL, 'Your license is about to expire on 2025-05-08'),
(3, 'Certification', '2025-05-13 07:41:01', 'System', '17', NULL, 'You are now a certified guide as of 2023-05-08'),
(4, 'Cancel Request', '2025-05-13 07:41:01', 'Admin', 'All Guides', NULL, 'A cancellation has been approved for Tour #123.'),
(5, 'Cancel Request', '2025-05-13 08:05:42', 'System', '6', NULL, 'A cancellation has been approved for Booking #20 on 20/05/2025 10:00:00.'),
(6, 'Message', '2025-05-13 08:57:50', '1', '14', 'hello', 'banana is good'),
(7, 'Message', '2025-05-13 08:58:59', '1', '17', 'Orang', 'Orange utan says uu aaa'),
(8, 'Message', '2025-05-13 09:15:39', '17', '7', 'Haiya', 'MSG is the best'),
(9, 'Message', '2025-05-13 12:12:54', '17', '7', 'test success', 'yeah'),
(10, 'Message', '2025-05-13 13:09:11', 'Admin', 'All Guides', 'hello guys', 'today is a good day'),
(11, 'Message', '2025-05-13 13:10:46', 'Admin', '17', 'do ur job', 'keep working man\n'),
(12, 'IoT Alert', '2025-05-13 17:38:28', 'System', 'Admin', '⚠️ Intrusion Detected by esp33_01', 'An intrusion was detected by device esp33_01 at 2024-05-09T22:09:12.000Z. Event: motion. Temperature: 28.5°C, Humidity: 67.3%, Pressure: 1012.6 hPa, Angle Status: normal, Mode: ON'),
(13, 'IoT Alert', '2025-05-13 17:42:48', 'System', 'Admin', '⚠️ Intrusion Detected by esp33_01', 'An intrusion was detected by device esp33_01 at 2024-05-09T22:09:12.000Z. Event: motion. Temperature: 28.5°C, Humidity: 67.3%, Pressure: 1012.6 hPa, Angle Status: normal, Mode: ON'),
(14, 'Announcement', '2025-05-14 00:21:29', 'Admin', 'All Guides', '', ''),
(15, 'IoT Alert', '2025-05-14 00:55:01', 'System', 'Admin', '⚠️ Intrusion Detected by esp33_01', 'An intrusion was detected by device esp33_01 at 2024-05-09T22:09:12.000Z. Event: motion. Temperature: 28.5°C, Humidity: 67.3%, Pressure: 1012.6 hPa, Angle Status: normal, Mode: ON'),
(16, 'IoT Alert', '2025-05-14 01:30:13', 'System', 'Admin', '⚠️ Intrusion Detected by esp32_01', 'An intrusion was detected by device esp32_01 at 2025-05-14T01:30:12.000Z. Event: motion. Temperature: 22.9°C, Humidity: 59.2%, Pressure: 1010.4 hPa, Angle Status: normal, Mode: ON'),
(17, 'IoT Alert', '2025-05-14 01:30:22', 'System', 'Admin', '⚠️ Intrusion Detected by esp32_01', 'An intrusion was detected by device esp32_01 at 2025-05-14T01:30:21.000Z. Event: motion. Temperature: 23°C, Humidity: 60.2%, Pressure: 1010.4 hPa, Angle Status: normal, Mode: ON'),
(18, 'IoT Alert', '2025-05-14 01:30:34', 'System', 'Admin', '⚠️ Intrusion Detected by esp32_01', 'An intrusion was detected by device esp32_01 at 2025-05-14T01:30:33.000Z. Event: motion. Temperature: 23°C, Humidity: 59.5%, Pressure: 1010.4 hPa, Angle Status: normal, Mode: ON'),
(19, 'IoT Alert', '2025-05-14 01:31:01', 'System', 'Admin', '⚠️ Intrusion Detected by esp32_01', 'An intrusion was detected by device esp32_01 at 2025-05-14T01:31:00.000Z. Event: motion. Temperature: 23°C, Humidity: 59.2%, Pressure: 1010.4 hPa, Angle Status: normal, Mode: ON'),
(20, 'IoT Alert', '2025-05-14 01:31:15', 'System', 'Admin', '⚠️ Intrusion Detected by esp32_01', 'An intrusion was detected by device esp32_01 at 2025-05-14T01:31:15.000Z. Event: motion. Temperature: 22.9°C, Humidity: 59.1%, Pressure: 1010.4 hPa, Angle Status: normal, Mode: ON'),
(21, 'IoT Alert', '2025-05-14 01:32:14', 'System', 'Admin', '⚠️ Intrusion Detected by esp32_01', 'An intrusion was detected by device esp32_01 at 2025-05-14T01:32:12.000Z. Event: motion. Temperature: 22.9°C, Humidity: 59.1%, Pressure: 1010.4 hPa, Angle Status: normal, Mode: ON'),
(22, 'Certification', '2025-05-14 07:23:41', 'System', '12', 'Certificate Issued: Certificate for Hello', 'You are now a certified guide for Certificate for Hello as of 14/05/2025'),
(23, 'Message', '2025-05-14 07:29:01', '12', '15', 'Hello sir', 'Good morning, I am new guide'),
(24, 'Message', '2025-05-14 07:37:33', '12', '17', 'hello', 'Bye then'),
(25, 'Certification', '2025-05-14 09:55:33', 'System', '17', 'Certificate Issued: Certificate for Hello', 'You are now a certified guide for Certificate for Hello as of 14/05/2025'),
(26, 'Certification', '2025-05-14 09:57:09', 'System', '17', 'Certificate Issued: Certificate for Let see', 'You are now a certified guide for Certificate for Let see as of 14/05/2025'),
(27, 'Certification', '2025-05-14 10:06:54', 'System', '17', 'Certificate Issued: Certificate for GO', 'You are now a certified guide for Certificate for GO as of 14/05/2025'),
(28, 'Certification', '2025-05-14 10:16:17', 'System', '12', 'Certificate Issued: Certificate for Let see', 'You are now a certified guide for Certificate for Let see as of 14/05/2025'),
(29, 'Certification', '2025-05-14 10:18:16', 'System', '12', 'Certificate Issued: Certificate for GO', 'You are now a certified guide for Certificate for GO as of 14/05/2025'),
(30, 'Certification', '2025-05-14 10:20:30', 'System', '12', 'Certificate Issued: Certificate for Introduction to Wildlife', 'You are now a certified guide for Certificate for Introduction to Wildlife as of 14/05/2025'),
(31, 'Certification', '2025-05-14 13:22:30', 'System', '17', 'Certificate Issued: Certificate for Course Test', 'You are now a certified guide for Certificate for Course Test as of 14/05/2025'),
(32, 'Certification', '2025-05-14 13:29:16', 'System', '17', 'Certificate Issued: Certificate for 2', 'You are now a certified guide for Certificate for 2 as of 14/05/2025'),
(33, 'Certification', '2025-05-14 13:53:33', 'System', '17', 'Certificate Issued: Certificate for Introduction to Wildlife', 'You are now a certified guide for Certificate for Introduction to Wildlife as of 14/05/2025'),
(34, 'Certification', '2025-05-14 14:09:22', 'System', '12', 'Certificate Issued: Certificate for Love Yourself', 'You are now a certified guide for Certificate for Love Yourself as of 14/05/2025'),
(35, 'License Expiry', '2025-05-14 16:20:55', 'System', '17', 'License 1', 'Your license will expire on 23/05/2025'),
(36, 'Course Issued', '2025-05-15 12:24:30', 'Admin', '4', 'Course Assigned: Hello', 'You have been enrolled in “Hello”.'),
(37, 'Message', '2025-05-15 16:01:51', 'Admin', '17', 'Licence eligibility', 'You now meet all requirements for the Master licence. Please submit your request.'),
(38, 'Message', '2025-05-15 16:09:38', 'Admin', '17', 'Licence renewal reminder', 'Your guide licence will expire in less than one month. Please renew it as soon as possible.'),
(39, 'Message', '2025-05-15 16:12:16', 'Admin', '12', 'Licence Eligibility', 'You now meet all requirements for the Senior Guide licence. Please submit your request.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guidenotifications`
--
ALTER TABLE `guidenotifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guidenotifications`
--
ALTER TABLE `guidenotifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
