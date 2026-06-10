import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { PostsController } from './modules/posts/posts.controller';
import { PostsService } from './modules/posts/posts.service';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
  imports: [FirebaseModule, UsersModule, PostsModule],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService, UsersService, PostsService],
})
export class AppModule {}
