import { Controller, Delete, Param, Post, Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { Pizza } from './pizza.entity';
import { UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('pizza')
export class PizzaController {
    constructor(
        private pizzaService: PizzaService, 
        private ingredientService: IngredientService
    ) {}

    @Get()
    async getPizzas(): Promise<Pizza[]> {
        return await this.pizzaService.getPizzas();
    }

    @Get(':id')
    async getPizza(@Param('id') id: number) {
        return await this.pizzaService.getPizza(id);
    }

    @Post('create')
    async createPizza(@Body() createPizzaDto: { name: string, ingredients: { name: string, price: number }[] }) {
        const pizza = await this.pizzaService.createPizza(createPizzaDto.name);
        for (let ingredient of createPizzaDto.ingredients) {
            await this.pizzaService.addIngredientToPizza(pizza, await this.ingredientService.createIngredient(ingredient.name, ingredient.price));
        }

        return await this.pizzaService.getPizza(pizza.id);
    }

    @Delete(':id')
    async deletePizza(@Param('id') id: number) {
        return await this.pizzaService.deletePizza(id);
    }

    @Post('addIngredients')
    async addIngredientToPizza(@Body() addIngredientToPizzaDto: { pizza_id: number, ingredients: {name: string, price: number}[] }) {
        const pizza = await this.pizzaService.getPizza(addIngredientToPizzaDto.pizza_id);

        for (let ingredient of addIngredientToPizzaDto.ingredients) {
            await this.pizzaService.addIngredientToPizza(pizza, await this.ingredientService.createIngredient(ingredient.name, ingredient.price));
        }

        return await this.pizzaService.getPizza(addIngredientToPizzaDto.pizza_id);
    }

    @Post('removeIngredients')
    async removeIngredientFromPizza(@Body() removeIngredientFromPizzaDto: { pizza_id: number, ingredients: {name: string, price: number}[] }) {
        const pizza = await this.pizzaService.getPizza(removeIngredientFromPizzaDto.pizza_id);

        for (let ingredient of removeIngredientFromPizzaDto.ingredients) {
            await this.pizzaService.removeIngredientFromPizza(pizza, await this.ingredientService.createIngredient(ingredient.name, ingredient.price));
        }

        return await this.pizzaService.getPizza(removeIngredientFromPizzaDto.pizza_id);
    }

    @Post('PutIngredientsAfter')
    async putIngredientAfter(putIngredientAfterDto: { pizza_id: number, ingredient: {name: string}, ingredients: {name: string, price: number}[] }) {
        const pizza = await this.pizzaService.getPizza(putIngredientAfterDto.pizza_id);

        // TODO
    }

    // @UseInterceptors(ClassSerializerInterceptor)
    // @Get('test')
    // async test() {
    //     const macDacPizza = await this.pizzaService.createPizza('MacDac Pizza');
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('tomato', 0.5));
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('sliced mushrooms', 0.5));
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('feta cheese', 1));
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('sausages', 1));
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('sliced onion', 0.5));
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('mozzarella cheese', 0.3));
    //     await this.pizzaService.addIngredientToPizza(macDacPizza, await this.ingredientService.createIngredient('oregano', 2));    
    
    //     const lovelyMushroomPizza = await this.pizzaService.createPizza('Lovely Mushroom Pizza');
    //     await this.pizzaService.addIngredientToPizza(lovelyMushroomPizza, await this.ingredientService.createIngredient('tomato', 0.5));
    //     await this.pizzaService.addIngredientToPizza(lovelyMushroomPizza, await this.ingredientService.createIngredient('bacon', 1));
    //     await this.pizzaService.addIngredientToPizza(lovelyMushroomPizza, await this.ingredientService.createIngredient('mozzarella cheese', 0.3));
    //     await this.pizzaService.addIngredientToPizza(lovelyMushroomPizza, await this.ingredientService.createIngredient('sliced mushrooms', 0.5));
    //     await this.pizzaService.addIngredientToPizza(lovelyMushroomPizza, await this.ingredientService.createIngredient('oregano', 2));    

    //     const pizzas = await this.pizzaService.getPizzas();
    //     return pizzas;
    // }
}
