import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { Ingredient } from './ingredient.entity';

@Injectable()
export class IngredientService {
    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
    ) {}

    async createIngredient(name: string, price: number) {
        let ingredient = await this.em.findOne(Ingredient, { name });

        if (ingredient) {
            ingredient.is_valid = true;
            ingredient.price = price;
            await this.em.persistAndFlush(ingredient);
            return ingredient;
        }

        ingredient = new Ingredient(name, price);
        await this.em.persistAndFlush(ingredient);
        return ingredient;
    }

    async getIngredient(id: number) {
        return await this.em.findOne(Ingredient, { id });
    }

    async getIngredients() {
        return await this.em.find(Ingredient, {});
    }
}
