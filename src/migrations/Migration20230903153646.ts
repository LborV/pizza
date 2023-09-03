import { Migration } from '@mikro-orm/migrations';

export class Migration20230903153646 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `ingredient` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `price` float not null, `is_valid` boolean not null default true, `c_date` datetime not null, `m_date` datetime not null, constraint ingredient_price_check check ("price" >= 0)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `ingredient` add unique `ingredient_name_unique`(`name`);');

    this.addSql('create table `pizza` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `price` int not null default 0, `is_valid` boolean not null default true, `c_date` datetime not null, `m_date` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pizza` add unique `pizza_name_unique`(`name`);');

    this.addSql('create table `pizza_ingredients` (`pizza_id_id` int unsigned not null, `ingredient_id_id` int unsigned not null, `order` smallint unsigned not null, `is_valid` boolean not null default true, `c_date` datetime not null, `m_date` datetime not null, primary key (`pizza_id_id`, `ingredient_id_id`), constraint pizza_ingredients_order_check check ("order" >= 0)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pizza_ingredients` add index `pizza_ingredients_pizza_id_id_index`(`pizza_id_id`);');
    this.addSql('alter table `pizza_ingredients` add index `pizza_ingredients_ingredient_id_id_index`(`ingredient_id_id`);');

    this.addSql('alter table `pizza_ingredients` add constraint `pizza_ingredients_pizza_id_id_foreign` foreign key (`pizza_id_id`) references `pizza` (`id`) on update cascade;');
    this.addSql('alter table `pizza_ingredients` add constraint `pizza_ingredients_ingredient_id_id_foreign` foreign key (`ingredient_id_id`) references `ingredient` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pizza_ingredients` drop foreign key `pizza_ingredients_ingredient_id_id_foreign`;');

    this.addSql('alter table `pizza_ingredients` drop foreign key `pizza_ingredients_pizza_id_id_foreign`;');

    this.addSql('drop table if exists `ingredient`;');

    this.addSql('drop table if exists `pizza`;');

    this.addSql('drop table if exists `pizza_ingredients`;');
  }

}
