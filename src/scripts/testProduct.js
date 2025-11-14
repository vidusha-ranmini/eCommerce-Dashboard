import { Product, Category } from '../models/index.js';
import { sequelize } from '../config/database.js';

async function testProductCreation() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get a category first
    const category = await Category.findOne();
    if (!category) {
      console.error('❌ No categories found. Please create a category first.');
      process.exit(1);
    }

    console.log('Found category:', category.name, '(ID:', category.id, ')\n');

    // Try creating a product with explicit values
    console.log('Attempting to create product...');
    const productData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      stock: 10,
      sku: 'TEST-SKU-' + Date.now(),
      imageUrl: 'https://example.com/image.jpg',
      categoryId: category.id,
      isActive: true
    };

    console.log('Product data:', JSON.stringify(productData, null, 2));

    const product = await Product.create(productData);
    
    console.log('\n✅ Product created successfully!');
    console.log('Product ID:', product.id);
    console.log('Product Name:', product.name);
    console.log('Product Price:', product.price);
    console.log('Product Stock:', product.stock);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating product:');
    console.error('Message:', error.message);
    console.error('Name:', error.name);
    
    if (error.original) {
      console.error('\n📝 Original PostgreSQL Error:');
      console.error('Code:', error.original.code);
      console.error('Detail:', error.original.detail);
      console.error('Message:', error.original.message);
      console.error('Full error:', error.original);
    }
    
    if (error.errors) {
      console.error('\n🔍 Validation Errors:');
      error.errors.forEach(err => {
        console.error(`- ${err.path}: ${err.message}`);
      });
    }

    console.error('\n📋 Full error object:', JSON.stringify(error, null, 2));
    
    process.exit(1);
  }
}

testProductCreation();
