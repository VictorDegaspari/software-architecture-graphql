import { Field, ID, InputType } from "type-graphql";

@InputType()
export class EditBookInput {
    @Field(_type => ID)
    id: String;

    @Field()
    title: String;

    @Field()
    description: String;

    @Field()
    price: Number;
}