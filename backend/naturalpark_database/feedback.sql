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
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `booking_id` int NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `sentiment_score` decimal(5,4) DEFAULT NULL,
  `sentiment_category` enum('positive','neutral','negative') COLLATE utf8mb4_unicode_ci DEFAULT 'neutral',
  `recommendation` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `booking_id`, `name`, `rating`, `comment`, `sentiment_score`, `sentiment_category`, `recommendation`, `created_at`, `updated_at`) VALUES
(1, 12, 3, '', 5, 'I don\'t see any orange utan bro', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:02:51', '2025-05-12 03:02:51'),
(2, 12, 3, '', 5, 'no orange utan here, why?', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:27:16', '2025-05-12 03:27:16'),
(3, 12, 3, '', 4, 'No orange utan', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:28:28', '2025-05-12 03:28:28'),
(4, 12, 3, '', 4, 'orange utan where?', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:29:09', '2025-05-12 03:29:09'),
(5, 12, 3, '', 5, 'orange utan? ', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:32:40', '2025-05-12 03:32:40'),
(6, 12, 3, '', 4, 'orange utan?', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:35:26', '2025-05-12 03:35:26'),
(7, 12, 3, '', 5, 'utan?', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:37:32', '2025-05-12 03:37:32'),
(8, 12, 3, '', 4, 'No orang utan?', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:55:13', '2025-05-12 03:55:13'),
(9, 12, 3, '', 5, 'happy', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:57:19', '2025-05-12 03:57:19'),
(10, 12, 3, '', 4, 'hahaha', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 03:59:10', '2025-05-12 03:59:10'),
(11, 12, 3, '', 5, 'oh no', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 04:00:54', '2025-05-12 04:00:54'),
(12, 12, 3, '', 4, 'nooo', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 04:02:28', '2025-05-12 04:02:28'),
(13, 12, 3, '', 4, 'no bro', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 04:31:22', '2025-05-12 04:31:22'),
(14, 12, 3, '', 4, 'holy shit', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 05:01:28', '2025-05-12 05:01:28'),
(15, 12, 3, '', 4, 'fuiyohh', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 05:27:32', '2025-05-12 05:27:32'),
(16, 14, 3, '', 4, 'thomas like it', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 08:53:39', '2025-05-12 08:53:39'),
(17, 14, 3, 'Dummy', 5, 'Hell yeah', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 16:21:02', '2025-05-12 16:42:54'),
(18, 14, 3, 'Banana', 3, 'Banana so good', 0.0000, 'neutral', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-12 16:55:10', '2025-05-12 16:55:10'),
(19, 14, 3, 'Sarah', 4, 'good man', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 17:08:54', '2025-05-12 17:08:54'),
(20, 14, 3, 'Jua', 2, 'good service', 0.0000, 'neutral', 'We appreciate your feedback and will work to improve your experience. Our staff is available at the visitor center to assist with any specific concerns.', '2025-05-12 17:12:53', '2025-05-12 17:12:53'),
(21, 14, 3, 'me', 4, 'no orang utan', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 17:21:06', '2025-05-12 17:21:06'),
(22, 17, 3, 'huhahaha', 5, 'nice', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-12 17:47:09', '2025-05-12 17:47:09'),
(23, 18, 3, 'Abu', 5, 'So bad', 0.0000, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-14 10:48:04', '2025-05-14 10:48:04'),
(24, 18, 3, 'Abu', 1, 'Baf', 0.0000, 'neutral', 'We appreciate your feedback and will work to improve your experience. Our staff is available at the visitor center to assist with any specific concerns.', '2025-05-14 10:52:46', '2025-05-14 10:52:46'),
(25, 17, 3, 'Guy', 4, 'where is orange utan?', 0.2800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 00:40:10', '2025-05-15 00:40:10'),
(26, 17, 3, 'Anonymous', 5, 'guide is not punctual', 0.5600, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 00:40:47', '2025-05-15 00:40:47'),
(27, 17, 3, 'Anonymous', 3, 'bad', -0.3000, 'negative', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-15 00:42:17', '2025-05-15 00:42:17'),
(28, 17, 3, 'Anonymous', 5, 'bad', 0.2600, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 00:42:36', '2025-05-15 00:42:36'),
(29, 17, 3, 'Anonymous', 3, 'guide is not friendly', 0.0000, 'neutral', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-15 00:43:50', '2025-05-15 00:43:50'),
(30, 17, 3, 'Anonymous', 3, 'not bad', -0.1000, 'neutral', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-15 00:45:54', '2025-05-15 00:45:54'),
(31, 17, 3, 'Anonymous', 3, 'why is there Pokemon?', -0.3000, 'negative', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-15 00:46:20', '2025-05-15 00:46:20'),
(32, 17, 3, 'Anonymous', 4, 'not bad', 0.1800, 'neutral', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 00:47:02', '2025-05-15 00:47:02'),
(33, 17, 3, 'Anonymous', 4, 'why can\'t I see orange utan?', -0.0200, 'neutral', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-15 00:50:34', '2025-05-15 00:50:34'),
(34, 17, 3, 'Anonymous', 3, 'why can\'t I see orange utan?', -0.3000, 'negative', 'We appreciate your feedback and will work to improve your experience. Our staff is available at the visitor center to assist with any specific concerns.', '2025-05-15 00:51:06', '2025-05-15 00:51:06'),
(35, 14, 3, 'Anonymous', 4, 'Nice work', 0.2800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 01:56:23', '2025-05-15 01:56:23'),
(36, 14, 9, 'Anonymous', 4, 'nice to meet the guide here', 0.2800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 02:30:41', '2025-05-15 02:30:41'),
(37, 14, 9, 'Anonymous', 4, 'nice to meet the guide here', 0.2800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 02:31:09', '2025-05-15 02:31:09'),
(38, 14, 9, 'Anonymous', 4, 'nice to meet the guide here', 0.2800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 02:31:42', '2025-05-15 02:31:42'),
(39, 14, 9, 'hello', 4, 'nice work', 0.2800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 02:35:21', '2025-05-15 02:35:21'),
(40, 14, 9, 'Anonymous', 4, 'bad timing', -0.0200, 'neutral', 'Thank you for your feedback. Consider checking out our visitor center for more information about park attractions.', '2025-05-15 02:36:27', '2025-05-15 02:36:27'),
(41, 14, 8, 'Anonymous', 4, 'good guide', 0.5800, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 02:39:18', '2025-05-15 02:39:18'),
(42, 14, 22, 'Anonymous', 5, 'bad work man', 0.2600, 'positive', 'Thanks for your positive feedback! You might also enjoy our guided tours and seasonal events.', '2025-05-15 02:45:34', '2025-05-15 02:45:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_sentiment` (`sentiment_category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
