const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Property = require("../models/Property");


// ==========================================
// GET ALL PROPERTIES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const properties = await Property.find()
            .sort({ createdAt: -1 });

        res.json(properties);

    } catch (error) {

        console.error("GET properties error:", error);

        res.status(500).json({
            message: "Failed to load properties"
        });

    }

});


// ==========================================
// ADD PROPERTY
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            location,
            type,
            price,
            bedrooms,
            bathrooms,
            area,
            image,
            description
        } = req.body;


        if (!name || !location || !price) {

            return res.status(400).json({
                message: "Name, location and price are required."
            });

        }


        const property = new Property({

            title: name,

            description:
                description ||
                "Newly added verified property.",

            price: Number(price),

            location: location,

            propertyType:
                type ||
                "Property",

            bedrooms:
                Number(bedrooms) || 0,

            bathrooms:
                Number(bathrooms) || 0,

            area:
                Number(area) || 0,

            images:
                image
                    ? [image]
                    : []

        });


        const savedProperty =
            await property.save();


        res.status(201).json(savedProperty);


    } catch (error) {

        console.error("ADD property error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// DELETE PROPERTY
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const id = req.params.id;


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                message: "Invalid property ID"
            });

        }


        const deletedProperty =
            await Property.findByIdAndDelete(id);


        if (!deletedProperty) {

            return res.status(404).json({
                message: "Property not found"
            });

        }


        res.json({

            message:
                "Property deleted successfully.",

            propertyId: id

        });


    } catch (error) {

        console.error("DELETE property error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports = router;