import { Min } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Book {
    @Field(_type => ID)
	id: string;

    @Field()
    title: String;

    @Field()
    description: String;

    @Field()
    @Min(0)
    price: Number;

    @Field()
    created_at: Date;
}