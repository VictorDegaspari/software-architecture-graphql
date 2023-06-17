import { Field, InputType } from "type-graphql";

@InputType()
export class CreateBookInput {
    @Field()
    image: String;

    @Field()
    title: String;

    @Field()
    description: String;

    @Field()
    price: Number;

    @Field()
    author_id: String;
}