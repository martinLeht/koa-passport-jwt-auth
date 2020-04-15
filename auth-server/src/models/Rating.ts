import Category from "./Category";

export default class Rating {
    ratingId!: number;
    reviewId!: number;
    value!: number;
    category!: Category;
}