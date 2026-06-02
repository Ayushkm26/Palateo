const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
  },
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  cartItems: [
    {
      itemId: {
        type: String,
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      restaurantId: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  ],
  status: {
    type: String,
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model('Order', contactSchema);
module.exports = orderModel;

// {
//   "orders": [
//     {
//       "id": "1747150983990",
//       "restaurantId": "1",
//       "userId": "1",
//       "name": "ansh",
//       "address": "489949848",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "Margherita Pizza",
//           "price": 399,
//           "quantity": 1,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
//         },
//         {
//           "itemId": "2",
//           "name": "Pasta Alfredo",
//           "price": 349,
//           "quantity": 3,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a"
//         }
//       ],
//       "status": "delivered",
//       "createdAt": "2025-05-13T21:13:03.990Z",
//       "updatedAt": "2025-05-13T16:50:16.806Z"
//     },
//     {
//       "id": "1747151093460",
//       "restaurantId": "1",
//       "userId": "1",
//       "name": "ansh",
//       "address": "huyvygvg",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "Margherita Pizza",
//           "price": 399,
//           "quantity": 1,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
//         },
//         {
//           "itemId": "2",
//           "name": "Pasta Alfredo",
//           "price": 349,
//           "quantity": 3,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a"
//         }
//       ],
//       "status": "confirmed",
//       "createdAt": "2025-05-13T21:14:53.460Z",
//       "updatedAt": "2025-05-13T16:05:55.735Z"
//     },
//     {
//       "id": "1747151579748",
//       "restaurantId": "1",
//       "userId": "1",
//       "name": "ansh",
//       "address": "yugyuftttt",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "Margherita Pizza",
//           "price": 399,
//           "quantity": 1,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
//         },
//         {
//           "itemId": "2",
//           "name": "Pasta Alfredo",
//           "price": 349,
//           "quantity": 3,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a"
//         }
//       ],
//       "status": "preparing",
//       "createdAt": "2025-05-13T15:52:59.748Z",
//       "updatedAt": "2025-05-13T16:13:45.937Z"
//     },
//     {
//       "id": "1747153165113",
//       "restaurantId": "2",
//       "userId": "1",
//       "name": "ansh",
//       "address": "vnvdkj",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "California Roll",
//           "price": 449,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351"
//         },
//         {
//           "itemId": "2",
//           "name": "Salmon Nigiri",
//           "price": 6.99,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1583623025817-d180a2221d0a"
//         },
//         {
//           "itemId": "3",
//           "name": "Miso Soup",
//           "price": 3.99,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb"
//         }
//       ],
//       "status": "pending",
//       "createdAt": "2025-05-13T16:19:25.113Z",
//       "updatedAt": "2025-05-13T16:19:25.113Z"
//     },
//     {
//       "id": "1747153351871",
//       "restaurantId": "2",
//       "userId": "1",
//       "name": "ansh",
//       "address": "bhjbj",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "California Roll",
//           "price": 449,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351"
//         },
//         {
//           "itemId": "2",
//           "name": "Salmon Nigiri",
//           "price": 6.99,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1583623025817-d180a2221d0a"
//         },
//         {
//           "itemId": "3",
//           "name": "Miso Soup",
//           "price": 3.99,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb"
//         }
//       ],
//       "status": "pending",
//       "createdAt": "2025-05-13T16:22:31.871Z",
//       "updatedAt": "2025-05-13T16:22:31.871Z"
//     },
//     {
//       "id": "1747153760490",
//       "restaurantId": "2",
//       "userId": "1",
//       "name": "ansh",
//       "address": "bn h g\n",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "California Roll",
//           "price": 449,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351"
//         },
//         {
//           "itemId": "2",
//           "name": "Salmon Nigiri",
//           "price": 6.99,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1583623025817-d180a2221d0a"
//         },
//         {
//           "itemId": "3",
//           "name": "Miso Soup",
//           "price": 3.99,
//           "quantity": 1,
//           "restaurantId": "2",
//           "image": "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb"
//         }
//       ],
//       "status": "pending",
//       "createdAt": "2025-05-13T16:29:20.490Z",
//       "updatedAt": "2025-05-13T16:29:20.490Z"
//     },
//     {
//       "id": "1747191423569",
//       "restaurantId": "1",
//       "userId": "3",
//       "name": "gorang ",
//       "address": "dohd",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "Margherita Pizza",
//           "price": 399,
//           "quantity": 1,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
//         },
//         {
//           "itemId": "2",
//           "name": "Pasta Alfredo",
//           "price": 349,
//           "quantity": 1,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a"
//         }
//       ],
//       "status": "ready",
//       "createdAt": "2025-05-14T02:57:03.569Z",
//       "updatedAt": "2025-05-14T02:58:11.251Z"
//     },
//     {
//       "id": "1747191741661",
//       "restaurantId": "1",
//       "userId": "3",
//       "name": "gorang ",
//       "address": "gytf",
//       "phone": "585844882847",
//       "cartItems": [
//         {
//           "itemId": "1",
//           "name": "Margherita Pizza",
//           "price": 399,
//           "quantity": 1,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
//         },
//         {
//           "itemId": "2",
//           "name": "Pasta Alfredo",
//           "price": 349,
//           "quantity": 3,
//           "restaurantId": "1",
//           "image": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a"
//         }
//       ],
//       "status": "pending",
//       "createdAt": "2025-05-14T03:02:21.661Z",
//       "updatedAt": "2025-05-14T03:02:21.661Z"
//     }
//   ]
// }