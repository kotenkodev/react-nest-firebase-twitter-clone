import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { LikesModule } from './modules/likes/likes.module';

@Module({
  imports: [FirebaseModule, UsersModule, PostsModule, AuthModule, LikesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
