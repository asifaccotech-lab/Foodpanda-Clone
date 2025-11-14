import bcrypt from 'bcryptjs';
import {
  sequelize,
  User,
  Address,
  Restaurant,
  Category,
  MenuItem,
} from './models/index.js';

export async function seedData() {
  console.log('Seeding database...');
  // Wipe data in development only
  const isDev = (process.env.NODE_ENV || 'development') === 'development';

  if (isDev) {
    await sequelize.sync({ force: true });
  }

  // Admin user
  const adminEmail = 'admin@foodapp.local';
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const admin = await User.create({
      name: 'Administrator',
      email: adminEmail,
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });
    await Address.create({
      userId: admin.id,
      street: '1 Admin Blvd',
      city: 'Metropolis',
      state: 'CA',
      zip: '90001'
    });
    console.log('Admin user created:', adminEmail);
  } else {
    console.log('Admin user already exists');
  }

  // Categories
  const categories = await Promise.all([
    Category.findOrCreate({ where: { name: 'Burgers' }, defaults: { name: 'Burgers' } }),
    Category.findOrCreate({ where: { name: 'Pizza' }, defaults: { name: 'Pizza' } }),
    Category.findOrCreate({ where: { name: 'Sushi' }, defaults: { name: 'Sushi' } }),
    Category.findOrCreate({ where: { name: 'Desserts' }, defaults: { name: 'Desserts' } }),
    Category.findOrCreate({ where: { name: 'Drinks' }, defaults: { name: 'Drinks' } }),
  ]);

  const categoryMap = {};
  for (const [cat] of categories) {
    categoryMap[cat.name] = cat.id;
  }

  // Restaurants
  const restData = [
    {
      name: 'Panda Burgers',
      description: 'Juicy burgers, fries, and shakes.',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
      rating: 4.6,
      deliveryFee: 2.99
    },
    {
      name: 'Sunset Pizza',
      description: 'Artisan pizzas with fresh toppings.',
      imageUrl: 'https://images.unsplash.com/photo-1548365328-9f547fb285c3',
      rating: 4.7,
      deliveryFee: 3.49
    },
    {
      name: 'Sakura Sushi',
      description: 'Traditional and fusion sushi rolls.',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
      rating: 4.8,
      deliveryFee: 4.99
    }
  ];

  const restaurants = [];
  for (const r of restData) {
    const [restaurant] = await Restaurant.findOrCreate({ where: { name: r.name }, defaults: r });
    restaurants.push(restaurant);
  }

  // Menu items
  const menuItems = [
    // Panda Burgers
    { restaurantName: 'Panda Burgers', category: 'Burgers', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese.', price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
    { restaurantName: 'Panda Burgers', category: 'Burgers', name: 'Double Cheeseburger', description: 'Two patties, double cheese.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
    { restaurantName: 'Panda Burgers', category: 'Drinks', name: 'Chocolate Shake', description: 'Rich chocolate shake.', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1568051243856-5b160697232b' },

    // Sunset Pizza
    { restaurantName: 'Sunset Pizza', category: 'Pizza', name: 'Margherita', description: 'Tomato, mozzarella, basil.', price: 11.99, imageUrl: 'https://images.unsplash.com/photo-1548365328-9f547fb285c3' },
    { restaurantName: 'Sunset Pizza', category: 'Pizza', name: 'Pepperoni', description: 'Classic pepperoni.', price: 13.99, imageUrl: 'https://images.unsplash.com/photo-1594007654729-4a0d1f4316c5' },
    { restaurantName: 'Sunset Pizza', category: 'Desserts', name: 'Tiramisu', description: 'Coffee-flavored Italian dessert.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1624996379697-75e63aee2cb2' },

    // Sakura Sushi
    { restaurantName: 'Sakura Sushi', category: 'Sushi', name: 'California Roll', description: 'Crab, avocado, cucumber.', price: 8.49, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },
    { restaurantName: 'Sakura Sushi', category: 'Sushi', name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo.', price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1584953222400-1bf1d03fbd21' },
    { restaurantName: 'Sakura Sushi', category: 'Drinks', name: 'Green Tea', description: 'Hot green tea.', price: 2.49, imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187' },
  ];

  for (const mi of menuItems) {
    const restaurant = restaurants.find(r => r.name === mi.restaurantName);
    if (!restaurant) continue;

    const categoryId = categoryMap[mi.category];
    await MenuItem.findOrCreate({
      where: { restaurantId: restaurant.id, name: mi.name },
      defaults: {
        restaurantId: restaurant.id,
        categoryId,
        name: mi.name,
        description: mi.description,
        price: mi.price,
        imageUrl: mi.imageUrl,
        isAvailable: true
      }
    });
  }

  console.log('Seeding completed.');
}