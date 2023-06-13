import { Field, InputType } from "type-graphql";

@InputType()
export class CreateBookInput {
    @Field()
    title: String;

    @Field()
    description: String;

    @Field()
    price: Number
}
