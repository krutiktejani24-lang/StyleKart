const CLOTH = ['S', 'M', 'L', 'XL'];
const KIDS = ['2-3Y', '4-5Y', '6-7Y', '8-9Y'];

export const GENDERS = ['All', 'Men', 'Women', 'Kids'];
export const TYPES = [
  { name: 'Clothes', icon: 'shirt-outline', kw: 'fashion,clothes', sub: 'Comfortable & Trendy' },
  { name: 'Shoes', icon: 'footsteps-outline', kw: 'sneakers,shoes', sub: 'Walk in Comfort' },
  { name: 'Bags', icon: 'bag-handle-outline', kw: 'handbag', sub: 'Stylish & Functional' },
  { name: 'Watches', icon: 'watch-outline', kw: 'wristwatch', sub: 'Timeless Classics' },
  { name: 'Accessories', icon: 'glasses-outline', kw: 'sunglasses', sub: 'Finishing Touches' },
];
export const COLORS = [
  { name: 'Tan', hex: '#8B5A2B' },
  { name: 'Camel', hex: '#C98B4A' },
  { name: 'Black', hex: '#1E2623' },
  { name: 'Sand', hex: '#D9CFC0' },
];
export const photo = (kw, lock, w = 480, h = 620) => `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`;
export const typeIcon = (t) => (TYPES.find((x) => x.name === t) || {}).icon || 'image-outline';

const sizesFor = (cat, type) => {
  if (type === 'Clothes') return cat === 'Kids' ? KIDS : CLOTH;
  if (type === 'Shoes') return cat === 'Men' ? ['UK 7', 'UK 8', 'UK 9', 'UK 10'] : cat === 'Women' ? ['UK 4', 'UK 5', 'UK 6', 'UK 7'] : ['UK 10C', 'UK 11C', 'UK 12C', 'UK 13C'];
  return ['One size'];
};
const DESC = {
  Clothes: 'Made from soft, quality fabric with a comfortable fit for everyday wear. Machine washable.',
  Shoes: 'Cushioned sole, strong grip and a comfortable fit for all-day wear.',
  Bags: 'Spacious main compartment with extra pockets and strong stitching. Built for daily use.',
  Watches: 'Reliable movement, scratch-resistant glass and a comfortable strap. Water resistant for daily splashes.',
  Accessories: 'A finishing touch that goes with most outfits. Lightweight and easy to carry.',
};
// Images come from loremflickr (keyword based). Replace the URL with your own product photos any time.
const mk = (id, brand, name, price, mrp, category, type, kw, rating) => ({
  id: String(id), brand, name, price, mrp, category, type, rating,
  sizes: sizesFor(category, type),
  image: photo(kw, id),
  reviews: 12 + ((id * 37) % 190),
  desc: `${name} by ${brand}. ${DESC[type]}`,
});

export const PRODUCTS = [
  mk(1, 'Roadster', 'Slim Fit Denim Jacket', 1499, 2999, 'Men', 'Clothes', 'denim,jacket', 4.3),
  mk(2, 'H&M', 'Regular Fit Chinos', 1299, 1999, 'Men', 'Clothes', 'chinos,trousers', 4.4),
  mk(3, 'Allen Solly', 'Cotton Polo T-shirt', 599, 1299, 'Men', 'Clothes', 'polo,shirt', 4.2),
  mk(4, 'Levis', 'Classic Blue Jeans', 1799, 3499, 'Men', 'Clothes', 'jeans', 4.5),
  mk(5, 'Puma', 'Everyday Running Shoes', 2499, 4999, 'Men', 'Shoes', 'running,shoes', 4.5),
  mk(6, 'Nike', 'Court Casual Sneakers', 3299, 5499, 'Men', 'Shoes', 'sneakers', 4.6),
  mk(7, 'Red Tape', 'Leather Formal Shoes', 1999, 3999, 'Men', 'Shoes', 'leather,shoes', 4.1),
  mk(8, 'Wildcraft', '25L Travel Backpack', 1199, 2499, 'Men', 'Bags', 'backpack', 4.4),
  mk(9, 'Hidesign', 'Leather Laptop Bag', 2799, 5499, 'Men', 'Bags', 'laptop,bag', 4.3),
  mk(10, 'Fossil', 'Chronograph Analog Watch', 6999, 11999, 'Men', 'Watches', 'wristwatch', 4.6),
  mk(11, 'Casio', 'Digital Sports Watch', 1499, 2495, 'Men', 'Watches', 'digital,watch', 4.2),
  mk(12, 'Fastrack', 'Wayfarer Sunglasses', 899, 1599, 'Men', 'Accessories', 'sunglasses', 4.0),
  mk(13, 'Wrangler', 'Leather Bi-fold Wallet', 499, 999, 'Men', 'Accessories', 'leather,wallet', 4.3),
  mk(14, 'Biba', 'Printed Cotton Kurta', 899, 1799, 'Women', 'Clothes', 'kurta', 4.1),
  mk(15, 'Global Desi', 'Floral Maxi Dress', 1199, 2599, 'Women', 'Clothes', 'maxi,dress', 4.2),
  mk(16, 'W', 'Embroidered Anarkali Set', 1899, 3799, 'Women', 'Clothes', 'anarkali', 4.6),
  mk(17, 'Only', 'High-Rise Skinny Jeans', 1099, 2299, 'Women', 'Clothes', 'jeans,woman', 4.0),
  mk(18, 'Vero Moda', 'Ruched Crop Top', 699, 1399, 'Women', 'Clothes', 'crop,top', 4.1),
  mk(19, 'Metro', 'Block Heel Sandals', 1499, 2999, 'Women', 'Shoes', 'heels', 4.2),
  mk(20, 'Bata', 'Comfort Ballet Flats', 799, 1499, 'Women', 'Shoes', 'ballet,flats', 4.0),
  mk(21, 'Adidas', 'Lite Running Sneakers', 2799, 4999, 'Women', 'Shoes', 'sneakers,woman', 4.5),
  mk(22, 'Caprese', 'Structured Handbag', 1999, 3999, 'Women', 'Bags', 'handbag', 4.4),
  mk(23, 'Lavie', 'Canvas Tote Bag', 899, 1799, 'Women', 'Bags', 'tote,bag', 4.1),
  mk(24, 'Baggit', 'Mini Sling Bag', 1299, 2599, 'Women', 'Bags', 'sling,bag', 4.3),
  mk(25, 'Titan', 'Rose Gold Analog Watch', 3499, 5995, 'Women', 'Watches', 'rose,gold,watch', 4.7),
  mk(26, 'Fastrack', 'Cat-Eye Sunglasses', 799, 1499, 'Women', 'Accessories', 'sunglasses,woman', 4.2),
  mk(27, 'Accessorize', 'Pearl Drop Earrings', 399, 799, 'Women', 'Accessories', 'earrings', 4.4),
  mk(28, 'Max Kids', 'Graphic Cotton T-shirt', 349, 699, 'Kids', 'Clothes', 'kids,tshirt', 4.0),
  mk(29, 'Gini & Jony', 'Striped Hoodie', 599, 1199, 'Kids', 'Clothes', 'kids,hoodie', 4.3),
  mk(30, 'Hopscotch', 'Party Frock', 799, 1599, 'Kids', 'Clothes', 'girl,dress', 4.2),
  mk(31, 'Skechers', 'Light-up Sneakers', 1299, 2499, 'Kids', 'Shoes', 'kids,sneakers', 4.5),
  mk(32, 'Bata', 'Velcro School Shoes', 699, 1199, 'Kids', 'Shoes', 'school,shoes', 4.1),
  mk(33, 'Skybags', 'Cartoon School Backpack', 799, 1599, 'Kids', 'Bags', 'school,backpack', 4.4),
];

export const discount = (p) => Math.round(((p.mrp - p.price) / p.mrp) * 100);
export const inr = (n) => '\u20B9' + Math.round(n).toLocaleString('en-IN');
export const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
