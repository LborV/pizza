import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PizzaController } from './pizza/pizza.controller';
import { PizzaService } from './pizza/pizza.service';
import { IngredientService } from './ingredient/ingredient.service';
import { IngredientController } from './ingredient/ingredient.controller';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
  ],
  controllers: [PizzaController, IngredientController],
  providers: [PizzaService, IngredientService],
})
export class AppModule {}
