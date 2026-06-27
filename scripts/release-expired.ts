/**
 * Release expired inventory reservations.
 * This script performs the same cleanup as the cron endpoint.
 */

import { prisma } from "../src/lib/prisma";
import { releaseExpiredReservations } from "../src/lib/reservations";

async function main() {
  const count = await releaseExpiredReservations(prisma);

  console.log(
    `[release-expired] Released ${count} expired reservation(s) at ${new Date().toISOString()}`
  );

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});