
CREATE DATABASE IF NOT EXISTS `journy_junkies`;
USE `journy_junkies`;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `author` text NOT NULL,
  `comment` text NOT NULL,
  `post_id` int(11) NOT NULL DEFAULT 0,
  `author_id` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__posts` (`post_id`),
  CONSTRAINT `FK__posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `author` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `tag` text DEFAULT NULL,
  `map_coords` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `user` text DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `post_author` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ratings_posts` (`post_id`),
  CONSTRAINT `FK_ratings_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;