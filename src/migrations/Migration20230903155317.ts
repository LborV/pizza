import { Migration } from '@mikro-orm/migrations';

export class Migration20230903155317 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pizza` modify `price` float not null default 0;');
    this.addSql('alter table `pizza` add constraint pizza_price_check check("price" >= 0);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pizza` modify `price` int not null default 0;');
    this.addSql('alter table `pizza` drop constraint pizza_price_check;');
  }

}
