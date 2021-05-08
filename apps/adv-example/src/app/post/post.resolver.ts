import { Resolver } from '@nestjs/graphql';
import { PostSchema } from '../models/post.schema';

@Resolver((of) => PostSchema)
export class PostResolver {}
