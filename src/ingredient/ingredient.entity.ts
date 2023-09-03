import { Check, Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Ingredient {
    @PrimaryKey({ unsigned: true })
    id: number;

    @Property({ unique: true })
    name: string;

    @Property({ columnType: 'float', nullable: false })
    @Check({ expression: '"price" >= 0' })
    price: number;

    @Property({ columnType: 'boolean', default: true })
    is_valid: boolean;

    @Property({ columnType: 'datetime' })
    c_date: Date = new Date();
  
    @Property({ columnType: 'datetime', onUpdate: () => new Date() })
    m_date: Date = new Date();

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}