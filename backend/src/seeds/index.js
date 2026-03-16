import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ENV } from "../config/env.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const products = [
  {
    name: "CPU Intel Core i9-14900K",
    description:
      "Vi xử lý flagship với 24 nhân 32 luồng, xung nhịp lên đến 6.0GHz. Sức mạnh tối thượng cho gaming và đồ họa chuyên nghiệp.",
    price: 15490000,
    stock: 15,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_CPU_1", "LINK_ANH_CPU_2"],
    averageRating: 4.9,
    totalReviews: 85,
  },
  {
    name: "Card màn hình ASUS ROG Strix RTX 4090",
    description:
      "Vua của các dòng card đồ họa hiện nay với 24GB VRAM GDDR6X. Hỗ trợ Ray Tracing và DLSS 3 mới nhất cho trải nghiệm 4K mượt mà.",
    price: 52990000,
    stock: 5,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_GPU_1", "LINK_ANH_GPU_2"],
    averageRating: 5.0,
    totalReviews: 42,
  },
  {
    name: "RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5",
    description:
      "Bộ nhớ DDR5 hiệu năng cao với bus 6000MHz. Thiết kế tích hợp đèn LED RGB tùy chỉnh qua phần mềm iCUE.",
    price: 3250000,
    stock: 40,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_RAM_1", "LINK_ANH_RAM_2"],
    averageRating: 4.8,
    totalReviews: 156,
  },
  {
    name: "Mainboard MSI MPG Z790 Carbon WiFi",
    description:
      "Bo mạch chủ cao cấp hỗ trợ socket LGA 1700, thiết kế phase nguồn mạnh mẽ và khả năng kết nối WiFi 6E tốc độ cao.",
    price: 10890000,
    stock: 20,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_MAIN_1", "LINK_ANH_MAIN_2"],
    averageRating: 4.7,
    totalReviews: 64,
  },
  {
    name: "SSD Samsung 990 Pro 1TB M.2 NVMe",
    description:
      "Ổ cứng SSD PCIe Gen4 với tốc độ đọc ghi lên đến 7450/6900 MB/s. Lựa chọn số 1 để tối ưu tốc độ load game và ứng dụng.",
    price: 2850000,
    stock: 100,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_SSD_1", "LINK_ANH_SSD_2"],
    averageRating: 4.9,
    totalReviews: 312,
  },
  {
    name: "Nguồn Corsair RM1000e 1000W 80 Plus Gold",
    description:
      "Nguồn máy tính Full Modular công suất thực, chuẩn 80 Plus Gold đảm bảo hiệu suất và độ ổn định cho dàn PC high-end.",
    price: 3950000,
    stock: 30,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_PSU_1", "LINK_ANH_PSU_2"],
    averageRating: 4.6,
    totalReviews: 89,
  },
  {
    name: "Tản nhiệt nước AIO DeepCool LT720",
    description:
      "Hệ thống tản nhiệt nước 360mm với thiết kế block gương vô cực cực đẹp, hiệu năng giải nhiệt vượt trội cho CPU đời mới.",
    price: 3150000,
    stock: 25,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_COOLER_1", "LINK_ANH_COOLER_2"],
    averageRating: 4.5,
    totalReviews: 112,
  },
  {
    name: "Vỏ Case NZXT H9 Flow White",
    description:
      "Vỏ case thiết kế bể cá sang trọng với mặt kính cường lực, tối ưu luồng khí giúp linh kiện luôn mát mẻ.",
    price: 4490000,
    stock: 12,
    category: "Linh kiện máy tính",
    images: ["LINK_ANH_CASE_1", "LINK_ANH_CASE_2"],
    averageRating: 4.8,
    totalReviews: 56,
  },
  {
    name: "Màn hình Dell UltraSharp U2723QE 4K",
    description:
      "Màn hình đồ họa 27 inch độ phân giải 4K, tấm nền IPS Black cho độ tương phản cao và màu sắc chính xác tuyệt đối.",
    price: 13900000,
    stock: 18,
    category: "Màn hình",
    images: ["LINK_ANH_MONITOR_1", "LINK_ANH_MONITOR_2"],
    averageRating: 4.9,
    totalReviews: 204,
  },
  {
    name: "Bàn phím cơ AKKO 3098B Multi-Mode",
    description:
      "Bàn phím cơ không dây layout 98 phím, switch AKKO v3 độc quyền, hỗ trợ hot-swap và kết nối 3 chế độ linh hoạt.",
    price: 2150000,
    stock: 55,
    category: "Phụ kiện",
    images: ["LINK_ANH_KB_1", "LINK_ANH_KB_2"],
    averageRating: 4.7,
    totalReviews: 178,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert seed products
    await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${products.length} products`);

    // Display summary
    const categories = [...new Set(products.map((p) => p.category))];
    console.log("\n📊 Seeded Products Summary:");
    console.log(`Total Products: ${products.length}`);
    console.log(`Categories: ${categories.join(", ")}`);

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database seeding completed and connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
