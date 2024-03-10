-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 11, 2024 at 12:27 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `snapshot`
--

-- --------------------------------------------------------

--
-- Table structure for table `emotiondata`
--

CREATE TABLE `emotiondata` (
  `emotion_data_id` int(11) NOT NULL,
  `date_time_record` datetime NOT NULL,
  `enjoyment` int(11) NOT NULL,
  `sadness` int(11) NOT NULL,
  `anger` int(11) NOT NULL,
  `contempt` int(11) NOT NULL,
  `disgust` int(11) NOT NULL,
  `fear` int(11) NOT NULL,
  `surprise` int(11) NOT NULL,
  `context_trigger` text NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emotiondata`
--

INSERT INTO `emotiondata` (`emotion_data_id`, `date_time_record`, `enjoyment`, `sadness`, `anger`, `contempt`, `disgust`, `fear`, `surprise`, `context_trigger`, `user_id`) VALUES
(6, '2024-02-06 19:45:50', 1, 1, 1, 1, 1, 1, 1, '1', 10),
(8, '2024-02-19 21:13:00', 1, 1, 1, 1, 1, 1, 1, 'test\r\n', 10),
(9, '2024-02-25 13:32:00', 10, 1, 3, 1, 1, 6, 10, 'Surprise party', 10),
(10, '2024-03-10 15:47:04', 3, 4, 8, 1, 6, 2, 4, 'testing api with other profile', 11);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(9, 'first in list', 'new', 'test1@gmail.com', 'test123'),
(10, 'test1', 'test2', 'test@gmail.com', 'test123'),
(11, 'jarlath', 'oneill', 'jarlath.oneill95@gmail.com', 'password');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emotiondata`
--
ALTER TABLE `emotiondata`
  ADD PRIMARY KEY (`emotion_data_id`),
  ADD KEY `FK_user_user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emotiondata`
--
ALTER TABLE `emotiondata`
  MODIFY `emotion_data_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emotiondata`
--
ALTER TABLE `emotiondata`
  ADD CONSTRAINT `FK_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
