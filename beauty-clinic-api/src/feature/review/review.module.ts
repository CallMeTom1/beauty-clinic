import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {Review} from "./data/model/review.entity";
import {User} from "@feature/user/model";
import {Product} from "../product/data/entity/product.entity";
import {Care} from "@feature/care/data";
import {ReviewController} from "./review.controller";
import {ReviewService} from "./review.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Review,     // Notre entité Review
            User,       // Nécessaire pour la relation avec l'utilisateur
            Product,    // Nécessaire pour la relation avec les produits
            Care        // Nécessaire pour la relation avec les soins
        ])
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService] // Au cas où on aurait besoin d'utiliser le service dans d'autres modules
})
export class ReviewModule {}