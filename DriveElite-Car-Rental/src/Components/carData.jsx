import React from 'react'

const carData = [
  {
    id: 1,
    name: "Mercedes-Benz C-Class",
    image:
      "https://images.unsplash.com/photo-1686562483617-3cf08d81e117?auto=format&fit=crop&q=80&w=800",
    price: 6300,
    specs: ["Auto", "4 Seats", "A/C"],
    category: "luxury",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Maruti Suzuki Swift",
    image:
      "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?auto=format&fit=crop&q=80&w=800",
    price: 2800,
    specs: ["Manual", "5 Seats", "A/C"],
    category: "budget",
    tag: "Budget",
  },
  {
    id: 3,
    name: "Toyota Fortuner",
    image:
      "https://media.istockphoto.com/id/1047980380/photo/toyota-fortuner-in-desert.webp?s=1024x1024&w=is&k=20&c=YtEVCUWEZEtuaJeAnrJgWYX9oDoO0cxhaXfjZFaMt08=",
    price: 7600,
    specs: ["Auto", "7 Seats", "4x4"],
    category: "suv",
    tag: "New",
  },
  {
    id: 4,
    name: "Porsche 911 Convertible",
    image:
      "https://images.unsplash.com/photo-1709791195523-4e9382c2dc6b?auto=format&fit=crop&q=80&w=800",
    price: 9600,
    specs: ["Auto", "2 Seats", "Premium"],
    category: "luxury",
    tag: "Exclusive",
  },
  {
    id: 5,
    name: "Kia Carnival",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1XNP1gZQXR1W4-2mUTPM9eqN0gctgXho0Kw&s",
    price: 4800,
    specs: ["Auto", "8 Seats", "A/C"],
    category: "suv",
    tag: "Family",
  },
  {
    id: 6,
    name: "Tata Nexon EV",
    image:
      "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon-EV/11024/1755845297648/front-left-side-47.jpg",
    price: 3600,
    specs: ["Auto", "4 Seats", "Eco"],
    category: "electric",
    tag: "Eco",
  },
  {
    id: 7,
    name: "Ford Mustang GT",
    image:
      "https://images.unsplash.com/photo-1560801877-7bda6dd63e51?auto=format&fit=crop&q=80&w=800",
    price: 8800,
    specs: ["Manual", "4 Seats", "Sport"],
    category: "luxury",
    tag: "Power",
  },
  {
    id: 8,
    name: "Hyundai Verna",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJSVR0ce9LGwF_Rxw8EXFZJHBwWZQEI2cRjw&s",
    price: 3200,
    specs: ["Auto", "5 Seats", "A/C"],
    category: "budget",
    tag: "Standard",
  },
  {
    id: 9,
    name: "Mahindra XUV700",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqjgn8wvohVqDcW2sG-XMATsvSueFbNq04fA&s",
    price: 6000,
    specs: ["Auto", "5 Seats", "Hybrid"],
    category: "suv",
    tag: "Eco",
  },
  {
    id: 10,
    name: "Renault Kwid",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnTRQvdleB9WXIy5gbg_TS0853HzXmBT_7lQ&s",
    price: 2400,
    specs: ["Manual", "4 Seats", "Basic"],
    category: "budget",
    tag: "Lowest Price",
  },
  {
    id: 11,
    name: "Ford F-150 Raptor",
    image:
      "https://d3jvxfsgjxj1vz.cloudfront.net/news/wp-content/uploads/2024/02/08153758/Ford-F-150-Raptor.jpg",
    price: 8400,
    specs: ["Auto", "5 Seats", "Towing"],
    category: "suv",
    tag: "Utility",
  },
  {
    id: 12,
    name: "Tesla Model S",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGUWyX6vwNYjMDHGrz1f86FDvVUn7UNuqjfQ&s",
    price: 10400,
    specs: ["Auto", "4 Seats", "Fast Charge"],
    category: "electric",
    tag: "Top Rated",
  },
  {
    id: 13,
    name: "Toyota Corolla Hybrid",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZlSiLmWj-KQVkvPj7ClmnLD-E8xDGBrf56w&s",
    price: 4400,
    specs: ["Auto", "5 Seats", "Hybrid"],
    category: "budget",
    tag: "Eco Saver",
  },
  {
    id: 14,
    name: "Hyundai Venue",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiSLjFCX_iK5Gk21DKJhaxWAvIUx1hwjKODA&s",
    price: 3850,
    specs: ["Manual", "5 Seats", "Touchscreen"],
    category: "suv",
    tag: "City Ride",
  },
  {
    id: 15,
    name: "Suzuki Alto",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddwUrEY7ttWAq9-nRVzQCKkh1SLCjkkRoBQ&s",
    price: 2600,
    specs: ["Manual", "4 Seats", "Basic"],
    category: "budget",
    tag: "Cheapest",
  },
  {
    id: 16,
    name: "MG ZS EV",
    image:
      "https://img.autocarpro.in/autocarpro/7bb1bfea-dbf0-4cbf-afa8-494020e4ac0f.jpg",
    price: 4000,
    specs: ["Auto", "5 Seats", "Long Range"],
    category: "electric",
    tag: "Fast Charge",
  },
  {
    id: 17,
    name: "Tata Safari",
    image:
      "https://www.tatamotors.com/wp-content/uploads/2023/10/New-Tata-Safari-Ext-1.jpg",
    price: 6800,
    specs: ["Auto", "7 Seats", "Premium"],
    category: "suv",
    tag: "Adventure",
  },
  {
    id: 18,
    name: "BMW 3 Series",
    image:
      "https://images.91wheels.com/assets/c_images/gallery/bmw/3-series-gran-limousine/bmw-3-series-gran-limousine-0-1742542140.jpg?w=840&q=50",
    price: 7900,
    specs: ["Auto", "4 Seats", "Sport"],
    category: "luxury",
    tag: "Premium",
  },
  {
    id: 19,
    name: "Audi Q5",
    image:
      "https://img.autocarindia.com/ExtraImages/20240715020110_Audiq5boldedition.jpg",
    price: 9200,
    specs: ["Auto", "5 Seats", "Quattro"],
    category: "luxury",
    tag: "Exclusive",
  },
  {
    id: 20,
    name: "Lamborghini Huracán",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800",
    price: 20000,
    specs: ["Auto", "2 Seats", "Exotic"],
    category: "luxury",
    tag: "Supercar",
  },
  {
    id: 21,
    name: "Land Rover Range Rover",
    image:
      "https://www.evoindia.com/evoindia/2020-07/842838bb-5851-44ee-8c27-f67d42dc23d2/Range_Rover.jpg",
    price: 11200,
    specs: ["Auto", "7 Seats", "Luxury"],
    category: "luxury",
    tag: "VIP",
  },
  {
    id: 22,
    name: "Toyota Fortuner (New Model)",
    image:
      "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2021/01/toyota-fortuner-1609933873.jpg",
    price: 7000,
    specs: ["Auto", "7 Seats", "4x4"],
    category: "suv",
    tag: "Popular",
  },
  {
    id: 23,
    name: "Mahindra Scorpio-N",
    image:
      "https://media.zigcdn.com/media/model/2025/Aug/model-extimg-208340368_600x400.jpg",
    price: 5600,
    specs: ["Manual", "7 Seats", "Rugged"],
    category: "suv",
    tag: "Adventure",
  },
  {
    id: 24,
    name: "Toyota Innova Crysta",
    image:
      "https://static3.toyotabharat.com/images/showroom/innova-mmc/avant-garde-bronze-1600x600.png",
    price: 5200,
    specs: ["Auto", "7 Seats", "A/C"],
    category: "suv",
    tag: "Popular",
  },
];

export default carData
