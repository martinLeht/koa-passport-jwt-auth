import Rating from "./Rating";

export default class Review {
    reviewId!: number;
    hoodId!: number;
    userId!: number;
    title!: string;
    text!: string;
    verified!: boolean;
    ratings?: Rating[]
}