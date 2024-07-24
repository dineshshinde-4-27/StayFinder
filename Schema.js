const joi = require("joi");
const Listing = require("./models/listing");

module.exports.listingSchema = joi.object({
  Listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      price: joi.number().required().min(0),
      imgUrl: joi.string().allow("", null),
      country: joi.string().required(),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().min(1).max(5).required(),
      comment: joi.string().required(),
    })
    .required(),
});
