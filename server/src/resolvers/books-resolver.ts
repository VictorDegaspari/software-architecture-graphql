import { randomUUID } from "node:crypto";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateBookInput } from "../dtos/inputs/create-book-input";
import { EditBookInput } from "../dtos/inputs/edit-book-input";
import { Book } from "../dtos/models/book-model";
import { MyContext } from "../server";

@Resolver(() => Book)
export class BooksResolvers {
    private booksData: Book[] = [];
    
    @Query(() => [Book])
    async getBooks(@Ctx() ctx: MyContext) {
        return ctx.booksResolver.booksData;
    }
    
    @Query(() => Book)
    async findBook(
        @Arg("id") id: String,
        @Ctx() ctx: MyContext
    ) {
        const book = ctx.booksResolver.booksData.find((book: Book) => book.id === id);
        return book;
    }

    @Mutation(() => Book)
    async createBook(
        @Arg('data') data: CreateBookInput,
        @Ctx() ctx: MyContext
    ) {
        // Chamaríamos a API aqui dentro caso aplicasse um BD real
        const author = ctx.usersResolver.usersData.find((user) => user.id === data.author_id);
        if (!author) throw new Error('User not found');
        const book = {
            id: randomUUID(),
            created_at: new Date(),
            title: data.title,
            description: data.description,
            price: data.price,
            image: data.image,
            author: author
        }

        ctx.booksResolver.booksData.push(book);

        return book;
    }

    @Mutation(() => Boolean)
    async deleteBook(
        @Arg('id') id: String,
        @Ctx() ctx: MyContext
    ) {
        const bookFound = ctx.booksResolver.booksData.find((book: Book) => book.id === id);
        if (!bookFound) return false;

        ctx.booksResolver.booksData = ctx.booksResolver.booksData.filter((book: Book) => book.id !== bookFound.id);
        return true;
    }

    @Mutation(() => Book)
    async editBook(
        @Arg('data') data: EditBookInput,
        @Ctx() ctx: MyContext
    ) {
        const book = ctx.booksResolver.booksData.find((book: Book) => data.id === book.id);
        if (!book) return;
        let newBook = { ...book, title: data.title, description: data.description, price: data.price };
        ctx.booksResolver.booksData = ctx.booksResolver.booksData.map((book: Book) => book.id === data.id ? newBook : book);
        return newBook;
    }
}