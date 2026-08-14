const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        propertyType: {
            type: String,
            default: "Property"
        },

        bedrooms: {
            type: Number,
            default: 0
        },

        bathrooms: {
            type: Number,
            default: 0
        },

        area: {
            type: Number,
            default: 0
        },

        images: {
            type: [String],
            default: []
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Property", propertySchema);