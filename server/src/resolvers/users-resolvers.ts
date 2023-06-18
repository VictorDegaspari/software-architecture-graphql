import { randomUUID } from "node:crypto";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput } from "../dtos/inputs/create-user-input";
import { User } from "../dtos/models/user-model";
import { MyContext } from "../server";

@Resolver(() => User)
export class UsersResolvers {
    public usersData: User[] = [];

    @Query(() => [User])
    async getUsers(@Ctx() ctx: MyContext) {
        return ctx.usersResolver.usersData;
    }

    @Query(() => User)
    async findUser(
        @Arg("id") id: String,
        @Ctx() ctx: MyContext
    ) {
        const user = ctx.usersResolver.usersData.find((user: User) => user.id === id);
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('id') id: String,
        @Ctx() ctx: MyContext
    ) {
        const userFound = ctx.usersResolver.usersData.find((user: User) => user.id === id);
        if (!userFound) return false;

        ctx.usersResolver.usersData = ctx.usersResolver.usersData.filter((user: User) => user.id !== userFound.id);
        return true;
    }

    @Mutation(() => User)
    async createUser(
        @Arg('data') data: CreateUserInput,
        @Ctx() ctx: MyContext
    ) {
        // Chamaríamos a API aqui dentro caso aplicasse um BD real
        const user = {
            id: randomUUID(),
            email: data.email,
            password: data.password,
            created_at: new Date(),
            name: data.name,
        }

        ctx.usersResolver.usersData.push(user);
        
        return user;
    }
}
