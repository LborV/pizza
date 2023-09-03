import { Controller, Post } from '@nestjs/common';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
    constructor(private IngredientService: IngredientService) {}

    @Post() 
    async createIngredient(createIngredientDto: { name: string, price: number }) {
        return await this.IngredientService.createIngredient(createIngredientDto.name, createIngredientDto.price);
    }
}
