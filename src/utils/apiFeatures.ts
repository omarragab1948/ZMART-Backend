import mongoose, { FilterQuery } from "mongoose";

export class ApiFeatures<T> {
  public queryString: Record<string, unknown>;
  public query: mongoose.Query<T[], T>;
  public filterQuery: FilterQuery<T> = {};

  constructor(
    query: mongoose.Query<T[], T>,
    queryString: Record<string, unknown>
  ) {
    this.queryString = queryString;
    this.query = query;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    for (const key in queryObj) {
      const value = queryObj[key];
      if (typeof value === "string") {
        queryObj[key] = { $regex: value, $options: "i" };
      }
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: string) => `$${match}`
    );
    this.filterQuery = JSON.parse(queryStr);
    const parsedFilter: FilterQuery<T> = JSON.parse(queryStr);
    this.query = this.query.find(parsedFilter);
    return this;
  }
  async totalCount() {
    return await this.query.model.countDocuments(this.filterQuery);
  }
  sort() {
    if (this.queryString.sort && typeof this.queryString.sort === "string") {
      const q = this.queryString.sort.split(",").join(" ");
      this.query.sort(q);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (
      this.queryString.fields &&
      typeof this.queryString.fields === "string"
    ) {
      const s = this.queryString.fields.split(",").join(" ");
      this.query.select(s);
    } else {
      this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = (this.queryString.page as number) * 1 || 1;
    const limit = (this.queryString.limit as number) * 1 || 5;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
