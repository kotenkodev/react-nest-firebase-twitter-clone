import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreatePostDto } from './create-post.dto';

@ValidatorConstraint({ name: 'postValidation', async: false })
export class PostValidationConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const dto = args.object as CreatePostDto;

    const hasImage = !!dto.photoURL?.trim();
    const hasTitle = !!dto.title?.trim();
    const hasContent = !!dto.content?.trim();

    if (hasImage) {
      return true;
    }

    return hasTitle && hasContent;
  }

  defaultMessage() {
    return 'Post must contain an image or both title and content';
  }
}
