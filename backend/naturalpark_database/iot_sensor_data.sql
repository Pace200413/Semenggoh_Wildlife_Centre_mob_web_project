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
-- Table structure for table `iot_sensor_data`
--

CREATE TABLE `iot_sensor_data` (
  `sensorlog_id` int NOT NULL,
  `timestamp` timestamp NOT NULL,
  `device` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `event` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `temperature` float DEFAULT NULL,
  `humidity` float DEFAULT NULL,
  `pressure` float DEFAULT NULL,
  `angle_status` varchar(50) DEFAULT NULL,
  `mode` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `iot_sensor_data`
--

INSERT INTO `iot_sensor_data` (`sensorlog_id`, `timestamp`, `device`, `event`, `temperature`, `humidity`, `pressure`, `angle_status`, `mode`) VALUES
(1, '2024-05-08 18:22:32', 'esp32_01', 'motion', NULL, NULL, NULL, NULL, NULL),
(2, '2024-05-08 18:28:30', 'esp32_01', 'motion', NULL, NULL, NULL, NULL, NULL),
(3, '2024-05-08 18:36:40', 'esp32_01', 'motion', NULL, NULL, NULL, NULL, NULL),
(4, '2024-05-08 18:48:43', 'esp32_01', 'motion', NULL, NULL, NULL, NULL, NULL),
(5, '2024-05-09 22:09:12', 'esp33_01', 'motion', 28.5, 67.3, 1012.6, 'normal', 'ON'),
(6, '2024-05-10 01:01:50', 'esp33_01', 'motion', 28.7, 66.8, 1012.8, 'normal', 'ON'),
(7, '2024-05-10 01:10:00', 'esp33_01', 'motion', 28.6, 67.1, 1012.5, 'alert', 'ON'),
(8, '2024-05-10 01:22:03', 'esp33_01', 'motion', 28.8, 66.5, 1012.4, 'normal', 'ON'),
(9, '2024-05-09 22:09:12', 'esp33_01', 'motion', 28.5, 67.3, 1012.6, 'normal', 'ON'),
(10, '2024-05-10 01:01:50', 'esp33_01', 'motion', 28.7, 66.8, 1012.8, 'normal', 'ON'),
(11, '2024-05-10 01:10:00', 'esp33_01', 'motion', 28.6, 67.1, 1012.5, 'alert', 'ON'),
(12, '2024-05-10 01:22:03', 'esp33_01', 'motion', 28.8, 66.5, 1012.4, 'normal', 'ON'),
(13, '2024-05-09 22:09:12', 'esp33_01', 'motion', 28.5, 67.3, 1012.6, 'normal', 'ON'),
(14, '2024-05-10 01:01:50', 'esp33_01', 'motion', 28.7, 66.8, 1012.8, 'normal', 'ON'),
(15, '2024-05-10 01:10:00', 'esp33_01', 'motion', 28.6, 67.1, 1012.5, 'alert', 'ON'),
(16, '2024-05-10 01:22:03', 'esp33_01', 'motion', 28.8, 66.5, 1012.4, 'normal', 'ON'),
(17, '2024-05-09 22:09:12', 'esp33_01', 'motion', 28.5, 67.3, 1012.6, 'normal', 'ON'),
(18, '2024-05-10 01:01:50', 'esp33_01', 'motion', 28.7, 66.8, 1012.8, 'normal', 'ON'),
(19, '2024-05-10 01:10:00', 'esp33_01', 'motion', 28.6, 67.1, 1012.5, 'alert', 'ON'),
(20, '2024-05-10 01:22:03', 'esp33_01', 'motion', 28.8, 66.5, 1012.4, 'normal', 'ON'),
(21, '2025-05-14 01:30:12', 'esp32_01', 'motion', 22.9, 59.2, 1010.4, 'normal', 'ON'),
(22, '2025-05-14 01:30:21', 'esp32_01', 'motion', 23, 60.2, 1010.4, 'normal', 'ON'),
(23, '2025-05-14 01:30:33', 'esp32_01', 'motion', 23, 59.5, 1010.4, 'normal', 'ON'),
(24, '2025-05-14 01:31:00', 'esp32_01', 'motion', 23, 59.2, 1010.4, 'normal', 'ON'),
(25, '2025-05-14 01:31:15', 'esp32_01', 'motion', 22.9, 59.1, 1010.4, 'normal', 'ON'),
(26, '2025-05-14 01:32:12', 'esp32_01', 'motion', 22.9, 59.1, 1010.4, 'normal', 'ON');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `iot_sensor_data`
--
ALTER TABLE `iot_sensor_data`
  ADD PRIMARY KEY (`sensorlog_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `iot_sensor_data`
--
ALTER TABLE `iot_sensor_data`
  MODIFY `sensorlog_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
