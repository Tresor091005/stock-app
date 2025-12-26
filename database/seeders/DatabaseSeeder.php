<?php


namespace Database\Seeders;


use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => UserRole::ADMIN
            ]
        );


        User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Customer User',
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => UserRole::CUSTOMER
            ]
        );


        $this->seedCategoriesAndProducts();
    }


    protected function seedCategoriesAndProducts()
    {
        $faker = \Faker\Factory::create();
        $imageId = 1;


        $categories = [
            'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Toys & Games', 'Sports & Outdoors'
        ];


        foreach ($categories as $categoryName) {
            $category = Category::create(['name' => $categoryName]);


            $products = match ($categoryName) {
                'Electronics' => ['Laptop', 'Smartphone', 'Headphones', 'Smartwatch', 'Camera', 'Tablet', 'Monitor'],
                'Books' => ['The Great Gatsby', 'To Kill a Mockingbird', '1984', 'The Lord of the Rings', 'The Catcher in the Rye', 'Pride and Prejudice', 'The Hobbit'],
                'Clothing' => ['T-Shirt', 'Jeans', 'Jacket', 'Sweater', 'Dress', 'Shoes', 'Socks'],
                'Home & Kitchen' => ['Coffee Maker', 'Blender', 'Microwave Oven', 'Cookware Set', 'Vacuum Cleaner', 'Air Fryer', 'Toaster'],
                'Toys & Games' => ['Lego Set', 'Monopoly', 'Action Figure', 'Puzzle', 'Drone', 'RC Car'],
                'Sports & Outdoors' => ['Basketball', 'Yoga Mat', 'Dumbbells', 'Tent', 'Hiking Boots', 'Bicycle'],
                default => [],
            };


            foreach ($products as $productName) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $productName,
                    'description' => $faker->sentence,
                    'price' => $faker->randomFloat(2, 10, 1000),
                    'stock_quantity' => $faker->numberBetween(0, 100),
                    'image' => "https://picsum.photos/id/{$imageId}/800/600",
                ]);
                
                $imageId++;
            }
        }
    }
}
