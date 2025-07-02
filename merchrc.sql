CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  role enum('admin','user') NOT NULL DEFAULT 'user',
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- pw hash admin123, user123
INSERT INTO users (username, password, role) VALUES
('admin', '$2y$10$u4uNvqaHUtMKPM.mmmIgS.34tILhMzkQNKSoN70LpsxoHYD6ehO.2', 'admin'),
('user', '$2y$10$LZwljChgDEm.A21KCjlm5u20ZEgsrkR8jx1ML8.3QwoB6BhJZ1zna', 'user');

CREATE TABLE products (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  price decimal(10,2) NOT NULL,  -- TIPE DATA DIPERBAIKI
  image_url varchar(255) NOT NULL,
  category_id int(11) NOT NULL,
  is_sold_out tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- 3. Masukkan data dengan format harga yang benar (tanpa simbol $)
INSERT INTO products (id, name, price, image_url, category_id, is_sold_out) VALUES
(1, 'Club Athleisure Halfzip Sweatshirt', 60.00, 'assets/image_copy.png', 1, 0), -- Nama file dan harga diperbaiki
(2, 'Club Athleisure Sweatshorts', 60.00, 'assets/image.png', 1, 0),
(3, 'Club Athleisure Classic Crew Socks', 60.00, 'assets/kaoskaki.png', 1, 0),
(4, 'Reality Club - Sunny Days T-shirt', 100.00, 'assets/sunnydays.png', 1, 1),
(5, 'Reality Club – Sunny Days Keychain', 60.00, 'assets/keychain.png', 2, 0),
(6, 'CLUB Red Silk Bandana', 60.00, 'assets/bandana.png', 2, 0),
(7, 'Reality Club - Lovestruck Premium Canvas Totebag', 60.00, 'assets/totebag.png', 2, 0),
(8, 'Reality Club - Black Logo Electronic Card', 100.00, 'assets/card.png', 2, 1),
(9, 'Reality Club 9th Anniversary Away Jersey', 60.00, 'assets/jersey.png', 3, 0),
(10, 'Reality Club Not Today Journal', 60.00, 'assets/journal.png', 3, 0),
(11, 'Reality Club - Lovestruck Limited Enamel Pin', 60.00, 'assets/pin.png', 3, 0),
(12, 'Reality Club - Am I Bothering You? Stainless Steel Mug', 100.00, 'assets/mug.png', 3, 1),
(13, 'Faiz Photocard', 20.00, 'https://i.pinimg.com/736x/fd/c0/86/fdc0866a1174683bcd42ac1704d2fd82.jpg', 1, 0);