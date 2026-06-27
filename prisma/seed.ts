import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.reservation.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  const warehouses = await Promise.all([
    prisma.warehouse.create({ data: { name: 'Bengaluru Central', code: 'BLR-1', city: 'Bengaluru' } }),
    prisma.warehouse.create({ data: { name: 'Mumbai West', code: 'BOM-1', city: 'Mumbai' } }),
    prisma.warehouse.create({ data: { name: 'Delhi NCR', code: 'DEL-1', city: 'Delhi' } }),
    prisma.warehouse.create({ data: { name: 'Hyderabad Hub', code: 'HYD-1', city: 'Hyderabad' } }),
    prisma.warehouse.create({ data: { name: 'Pune Fulfillment', code: 'PNQ-1', city: 'Pune' } }),
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: 'TSHIRT-BLK-M',
        name: 'Classic Crew Tee — Black, M',
        description: '100% cotton, mid-weight crew neck tee.',
        priceCents: 99900,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SNEAKER-WHT-9',
        name: 'Trail Runner Sneaker — White, UK 9',
        description: 'Lightweight running sneaker with breathable mesh.',
        priceCents: 349900,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MUG-CERAMIC-RED',
        name: 'Ceramic Mug — Red (Last Unit Demo)',
        description: 'Deliberately low stock — use this one to demo the 409 race condition.',
        priceCents: 49900,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'HOODIE-GRY-L',
        name: 'Fleece Hoodie — Grey, L',
        description: 'Heavyweight fleece hoodie, brushed interior.',
        priceCents: 249900,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'BACKPACK-NVY',
        name: 'Commuter Backpack — Navy',
        description: '20L water-resistant backpack with laptop sleeve.',
        priceCents: 199900,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'WATCH-STEEL-BLK',
        name: 'Steel Chrono Watch — Black Dial',
        description: 'Stainless steel case, quartz movement, 50m water resistant.',
        priceCents: 599900,
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SUNGLASSES-AVT',
        name: 'Aviator Sunglasses — Gold Frame',
        description: 'UV400 protection, polarized lenses.',
        priceCents: 129900,
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'WATERBOTTLE-STL',
        name: 'Insulated Steel Water Bottle — 1L',
        description: 'Double-wall vacuum insulation, keeps cold 24h.',
        priceCents: 89900,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'YOGAMAT-PURPLE',
        name: 'Premium Yoga Mat — Purple',
        description: '6mm thick, non-slip textured surface.',
        priceCents: 149900,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      },
    }),
    prisma.product.create({
      data: {
        sku: 'DESKLAMP-WHT',
        name: 'LED Desk Lamp — White',
        description: 'Adjustable brightness, USB-C powered, foldable arm.',
        priceCents: 159900,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      },
    }),
  ]);

  const [tshirt, sneaker, mug, hoodie, backpack, watch, sunglasses, bottle, yogaMat, deskLamp] = products;
  const [blr, bom, del, hyd, pnq] = warehouses;

  await prisma.stock.createMany({
    data: [
      { productId: tshirt.id, warehouseId: blr.id, totalUnits: 50, reservedUnits: 0 },
      { productId: tshirt.id, warehouseId: bom.id, totalUnits: 20, reservedUnits: 0 },
      { productId: tshirt.id, warehouseId: del.id, totalUnits: 0, reservedUnits: 0 },

      { productId: sneaker.id, warehouseId: blr.id, totalUnits: 8, reservedUnits: 0 },
      { productId: sneaker.id, warehouseId: bom.id, totalUnits: 3, reservedUnits: 0 },
      { productId: sneaker.id, warehouseId: del.id, totalUnits: 12, reservedUnits: 0 },

      // Only ONE unit available anywhere — good for demoing the concurrency
      // requirement (fire two simultaneous reservations, exactly one gets 409).
      { productId: mug.id, warehouseId: blr.id, totalUnits: 1, reservedUnits: 0 },
      { productId: mug.id, warehouseId: bom.id, totalUnits: 0, reservedUnits: 0 },
      { productId: mug.id, warehouseId: del.id, totalUnits: 0, reservedUnits: 0 },

      { productId: hoodie.id, warehouseId: blr.id, totalUnits: 15, reservedUnits: 0 },
      { productId: hoodie.id, warehouseId: hyd.id, totalUnits: 10, reservedUnits: 0 },
      { productId: hoodie.id, warehouseId: pnq.id, totalUnits: 5, reservedUnits: 0 },

      { productId: backpack.id, warehouseId: bom.id, totalUnits: 25, reservedUnits: 0 },
      { productId: backpack.id, warehouseId: del.id, totalUnits: 18, reservedUnits: 0 },
      { productId: backpack.id, warehouseId: hyd.id, totalUnits: 0, reservedUnits: 0 },

      { productId: watch.id, warehouseId: blr.id, totalUnits: 4, reservedUnits: 0 },
      { productId: watch.id, warehouseId: pnq.id, totalUnits: 6, reservedUnits: 0 },

      { productId: sunglasses.id, warehouseId: del.id, totalUnits: 30, reservedUnits: 0 },
      { productId: sunglasses.id, warehouseId: hyd.id, totalUnits: 14, reservedUnits: 0 },

      { productId: bottle.id, warehouseId: blr.id, totalUnits: 40, reservedUnits: 0 },
      { productId: bottle.id, warehouseId: bom.id, totalUnits: 22, reservedUnits: 0 },
      { productId: bottle.id, warehouseId: pnq.id, totalUnits: 12, reservedUnits: 0 },

      { productId: yogaMat.id, warehouseId: hyd.id, totalUnits: 16, reservedUnits: 0 },
      { productId: yogaMat.id, warehouseId: pnq.id, totalUnits: 9, reservedUnits: 0 },

      { productId: deskLamp.id, warehouseId: del.id, totalUnits: 20, reservedUnits: 0 },
      { productId: deskLamp.id, warehouseId: blr.id, totalUnits: 11, reservedUnits: 0 },
    ],
  });

  console.log('Seed complete:', { warehouses: warehouses.length, products: products.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
