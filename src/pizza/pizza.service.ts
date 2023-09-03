import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { Pizza } from './pizza.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { PizzaIngredients } from './pizza.entity';

@Injectable()
export class PizzaService {
    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
    ) {}

    async createPizza(name: string) {        
        let pizza = await this.em.findOne(Pizza, { name: name });
        
        if (pizza) {            
            pizza.is_valid = true;
            pizza.price = 0;
            let pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza });
            for (let pizzaIngredient of pizzaIngredients) {
                pizzaIngredient.is_valid = false;
            }

            await this.em.flush();
            return pizza;
        }

        pizza = new Pizza(name);
        this.em.persistAndFlush(pizza);
        return pizza;
    }

    async getPizza(id: number) {
        let pizza = await this.em.findOne(Pizza, { id, is_valid: true });
        console.log(id);
        
        pizza.Ingredients = [];
        let pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza, is_valid: true }, { orderBy: { order: 'ASC' } });        

        for (let pizzaIngredient of pizzaIngredients) {
            let ingredient = await this.em.findOne(Ingredient, pizzaIngredient.ingredient_id);            

            if(!ingredient.is_valid) {
                continue;
            }

            pizza.Ingredients.push(ingredient);
        }
        
        return pizza;
    }

    async getPizzas() {
        let pizzas = await this.em.find(Pizza, {is_valid: true});

        for(let i = 0; i < pizzas.length; i++) {
            pizzas[i] = await this.getPizza(pizzas[i].id);
        };

        return pizzas;
    }

    async calcPizzaPrice(pizza: Pizza) {
        const pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza, is_valid: true });
        let price = 0;

        for (let pizzaIngredient of pizzaIngredients) {
            let ingredient = await this.em.findOne(Ingredient, pizzaIngredient.ingredient_id);

            if(!ingredient.is_valid) {
                continue;
            }

            price += ingredient.price;
        }

        pizza.price = price * 1.5;
        this.em.persistAndFlush(pizza);
        return price;
    }

    async deletePizza(id: number) {
        let pizza = await this.em.findOne(Pizza, { id });
        pizza.is_valid = false;
        this.em.persistAndFlush(pizza);
        return pizza;
    }

    async addIngredientToPizza(pizza: Pizza, ingredient: Ingredient) {
        let pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        let order = await this.em.count(PizzaIngredients, { pizza_id: pizza });

        if (pizzaIngredient) {
            pizzaIngredient.is_valid = true;
            pizzaIngredient.order = order++;
            await this.em.persistAndFlush(pizzaIngredient);
            return pizzaIngredient;
        }

        pizzaIngredient = new PizzaIngredients(pizza, ingredient, order++);
        this.em.persistAndFlush(pizzaIngredient);
        await this.calcPizzaPrice(pizza);
        return pizzaIngredient;
    }

    async removeIngredientFromPizza(pizza: Pizza, ingredient: Ingredient) {
        const pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        pizzaIngredient.is_valid = false;
        await this.em.persistAndFlush(pizzaIngredient);
        return pizzaIngredient;
    }

    async deleteIngredientFromPizza(pizza: Pizza, ingredient: Ingredient) {
        const pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        pizzaIngredient.is_valid = false;
        await this.em.flush();
        return pizzaIngredient;
    }
}
