import { Check, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Ingredient } from "src/ingredient/ingredient.entity";

@Entity()
export class Pizza {
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

    Ingredients: Ingredient[];

    constructor(name: string) {
        this.name = name;
        this.price = 0;
    }
};

@Entity()
export class PizzaIngredients {
    @ManyToOne({ primary: true })
    pizza_id: Pizza;

    @ManyToOne({ primary: true })
    ingredient_id: Ingredient;

    @Property({ columnType: 'smallint', unsigned: true, nullable: false })
    @Check({ expression: '"order" >= 0' })
    order: number;

    @Property({ columnType: 'boolean', default: true })
    is_valid: boolean;

    @Property({ columnType: 'datetime' })
    c_date: Date = new Date();
  
    @Property({ columnType: 'datetime', onUpdate: () => new Date() })
    m_date: Date = new Date();

    constructor(pizza: Pizza, ingredient: Ingredient, order: number) {
        this.pizza_id = pizza;
        this.ingredient_id = ingredient;
        this.order = order;
    }
};