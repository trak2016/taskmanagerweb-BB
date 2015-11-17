CREATE DATABASE IF NOT EXISTS ola_w_kuchni CHARACTER SET utf8 COLLATE utf8_polish_ci;

CREATE TABLE IF NOT EXISTS owk_ingredient_units(
	id INT PRIMARY KEY AUTO_INCREMENT,
	unit_text TEXT NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS owk_ingredients(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ingredient_name TEXT NOT NULL,
	ingredient_default_unit_id INT NOT NULL,
	
	FOREIGN KEY(ingredient_default_unit_id) 
	REFERENCES owk_ingredient_units(id) 
		ON DELETE NO ACTION
		ON UPDATE NO ACTION  	
) ENGINE=INNODB; 

CREATE TABLE IF NOT EXISTS owk_recipes(
	id INT PRIMARY KEY AUTO_INCREMENT,
	recipe_title TEXT NOT NULL,
	recipe_teaser TEXT NOT NULL,
	recipe_body TEXT NOT NULL,
	recipe_prepare_time TIME, -- unix time??
	recipe_serves int,
	published SMALLINT(1) NOT NULL default 0
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS owk_recipe_ingredients(
	recipe_ingredients_recipe_id INT NOT NULL,	
	recipe_ingredients_ingredient_id INT NOT NULL,
	recipe_ingredients_quantity DECIMAL(10,2) NOT NULL,	
	recipe_ingredients_unit_id INT NOT NULL,

	FOREIGN KEY(recipe_ingredients_recipe_id) 
	REFERENCES owk_recipes(id) 
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,	

	FOREIGN KEY(recipe_ingredients_ingredient_id) 
	REFERENCES owk_ingredients(id) 
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,	

	FOREIGN KEY(recipe_ingredients_unit_id) 
	REFERENCES owk_ingredient_units(id) 
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS owk_categories(
	id INT PRIMARY KEY AUTO_INCREMENT,
	category_name TEXT NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS owk_recipe_categories(
	recipe_categories_recipe_id INT NOT NULL,
	recipe_categories_category_id INT NOT NULL,

	FOREIGN KEY(recipe_categories_recipe_id) 
	REFERENCES owk_recipes(id) 
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,	

	FOREIGN KEY(recipe_categories_category_id) 
	REFERENCES owk_categories(id) 
		ON DELETE NO ACTION
		ON UPDATE NO ACTION	
	
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS owk_images(
	id INT PRIMARY KEY AUTO_INCREMENT,
	images_path TEXT NOT NULL
) ENGINE=INNODB;


