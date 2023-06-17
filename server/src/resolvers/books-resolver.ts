import { randomUUID } from "node:crypto";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateBookInput } from "../dtos/inputs/create-book-input";
import { Book } from "../dtos/models/book-model";
import { User } from "../dtos/models/user-model";

@Resolver(() => Book)
export class BooksResolvers {
    private booksData: Book[] = [];
    
    @Query(() => [Book])
    async getBooks() {
        return this.booksData;
    }
    
    @Query(() => Book)
    async findBook(@Arg("id") id: String) {
        const book = this.booksData.find((book: Book) => book.id === id);
        return book;
    }

    @Mutation(() => Book)
    async createBook(
        @Arg('data') data: CreateBookInput,
        @Ctx("user") user: User
    ) {
        // Chamaríamos a API aqui dentro caso aplicasse um BD real
        const book = {
            id: randomUUID(),
            created_at: new Date(),
            title: data.title,
            description: data.description,
            price: data.price,
        }

        this.booksData.push({ ...book });

        return book;
    }

    @Mutation(() => Boolean)
    async deleteBook(@Arg('id') id: String) {
        const bookFound = this.booksData.find((book: Book) => book.id === id);
        if (!bookFound) return false;

        this.booksData = this.booksData.filter((book: Book) => book.id !== bookFound.id);
        return true;
    }

    //Fazer relacionamento
    // @FieldResolver(() => User)
    // async author(@Root() book: Book) {
    //     console.log(this.users)
    //     return book;
    // }
}
