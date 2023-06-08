import { Min } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./user-model";

@ObjectType()
export class Book {
    @Field(_type => ID)
	id: string;

    @Field()
    title: String;

    @Field()
    image: String;

    @Field()
    description: String;

    @Field()
    @Min(0)
    price: Number;

    @Field()
    created_at: Date;

    @Field(() => User)
    author: User;
}