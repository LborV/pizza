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

    async createPizza(name: string): Promise<Pizza> {        
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

    async getPizza(id: number): Promise<Pizza> {
        let pizza = await this.em.findOne(Pizza, { id, is_valid: true });
        
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

    async getPizzas(): Promise<Pizza[]> {
        let pizzas = await this.em.find(Pizza, {is_valid: true});

        for(let i = 0; i < pizzas.length; i++) {
            pizzas[i] = await this.getPizza(pizzas[i].id);
        };

        return pizzas;
    }

    async calcPizzaPrice(pizza: Pizza): Promise<number> {
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

    async deleteAllIngredientsFromPizza(pizza: Pizza): Promise<PizzaIngredients[]> {
        const pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza, is_valid: true });

        for (let pizzaIngredient of pizzaIngredients) {
            pizzaIngredient.is_valid = false;
        }

        await this.em.flush();
        return pizzaIngredients;
    }

    async deletePizza(id: number): Promise<Pizza> {
        let pizza = await this.em.findOne(Pizza, { id });
        pizza.is_valid = false;
        await this.deleteAllIngredientsFromPizza(pizza);
        this.em.persistAndFlush(pizza);
        return pizza;
    }

    async addIngredientToPizza(pizza: Pizza, ingredient: Ingredient): Promise<PizzaIngredients> {
        let pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        let order = await this.em.count(PizzaIngredients, { pizza_id: pizza, is_valid: true });

        if (pizzaIngredient) {
            pizzaIngredient.is_valid = true;
            pizzaIngredient.order = order++;
            await this.em.persistAndFlush(pizzaIngredient);
            await this.calcPizzaPrice(pizza);
            return pizzaIngredient;
        }

        pizzaIngredient = new PizzaIngredients(pizza, ingredient, order++);
        this.em.persistAndFlush(pizzaIngredient);
        await this.calcPizzaPrice(pizza);
        return pizzaIngredient;
    }

    async getIngredientsBefore(pizza: Pizza, ingredient: Ingredient): Promise<Ingredient[]> {
        const pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        const pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza, is_valid: true, order: { $lte: pizzaIngredient.order } });
        const ingredients: Ingredient[] = [];                

        for (let pizzaIngredient of pizzaIngredients) {
            ingredients.push(await this.em.findOne(Ingredient, pizzaIngredient.ingredient_id));
        }


        return ingredients;
    }

    async getIngredientsAfter(pizza: Pizza, ingredient: Ingredient): Promise<Ingredient[]> {
        const pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        const pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza, is_valid: true, order: { $gt: pizzaIngredient.order } });
        const ingredients: Ingredient[] = [];

        for (let pizzaIngredient of pizzaIngredients) {
            ingredients.push(await this.em.findOne(Ingredient, pizzaIngredient.ingredient_id));
        }

        return ingredients;
    }

    async clearIngredients(pizza: Pizza): Promise<PizzaIngredients[]> {
        const pizzaIngredients = await this.em.find(PizzaIngredients, { pizza_id: pizza, is_valid: true });

        for (let pizzaIngredient of pizzaIngredients) {
            pizzaIngredient.is_valid = false;
        }

        await this.em.flush();
        return pizzaIngredients;
    }

    async removeIngredientFromPizza(pizza: Pizza, ingredient: Ingredient): Promise<PizzaIngredients> {
        const pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        pizzaIngredient.is_valid = false;
        await this.em.persistAndFlush(pizzaIngredient);
        return pizzaIngredient;
    }

    async deleteIngredientFromPizza(pizza: Pizza, ingredient: Ingredient): Promise<PizzaIngredients> {
        const pizzaIngredient = await this.em.findOne(PizzaIngredients, { pizza_id: pizza, ingredient_id: ingredient });
        pizzaIngredient.is_valid = false;
        await this.em.flush();
        return pizzaIngredient;
    }
}
