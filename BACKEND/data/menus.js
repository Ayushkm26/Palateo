const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
    restaurantId:{
        type: String,
    },
    items:[
        {
            id:{
                type: String,
            },
            name:{
                type: String,
            },
            image:{
                type: String,
            },
            price:{
                type: Number,
            },
            type:{
                type: String,
            },
            description:{
                type: String,
            },
            rating:{
                type: Number,
            }
        }
    ]
})

const menuModel = mongoose.model('Menu', menuSchema);
module.exports = menuModel;