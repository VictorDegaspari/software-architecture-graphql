import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput } from "../dtos/inputs/create-user-input";
import { User } from "../dtos/models/user-model";

@Resolver(() => User)
export class UsersResolvers {
    public usersData: User[] = [];

    @Query(() => [User])
    async getUsers() {
        return this.usersData;
    }

    @Query(() => User)
    async findUser(@Arg("id") id: String) {
        const user = this.usersData.find((user: User) => user.id === id);
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: String) {
        const userFound = this.usersData.find((user: User) => user.id === id);
        if (!userFound) return false;

        this.usersData = this.usersData.filter((user: User) => user.id !== userFound.id);
        return true;
    }

    @Mutation(() => User)
    async createUser(@Arg('data') data: CreateUserInput) {
        // Chamaríamos a API aqui dentro caso aplicasse um BD real
        const user = {
            id: '1',
            email: data.email,
            password: data.password,
            created_at: new Date(),
            name: data.name,
        }

        this.usersData.push(user);
        
        return user;
    }

    // Fazer relacionamento
    // @FieldResolver(() => [Book])
    // async books(@Root() books: [Book]) {
    //     return books;
    // }
}
