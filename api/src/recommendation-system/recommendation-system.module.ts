import { Module } from '@nestjs/common';
import { RecommendationSystemService } from './recommendation-system.service';

@Module({
    providers: [RecommendationSystemService]
})
export class RecommendationSystemModule {}
