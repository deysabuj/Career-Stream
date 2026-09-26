import { connectDB } from '../database/db.js';
import { syncEngine } from '../sync/reconciler.js';
import { AuthService } from '../services/auth.service.js';

async function main() {
  console.log(' Starting Career Stream database seed script...');
  const connected = await connectDB();

  if (!connected) {
    console.log(' Skipping database seeding due to missing database connection.');
    return;
  }

  // 1. Create default demo user and admin user
  try {
    await AuthService.signup('demo@careerstream.dev', 'DemoPass123!', 'Alex Rivera');
    console.log(' Created Demo Student Account: demo@careerstream.dev');
  } catch (e) {
    console.log(' Demo user already exists.');
  }

  // 2. Execute sync engine across all registered connectors
  console.log(' Executing Sync & Reconciliation engine to populate initial jobs...');
  const syncResults = await syncEngine.syncAll();
  console.log(' Sync Results Summary:');
  console.table(syncResults);

  console.log(' Database seeding finished successfully.');
}

main().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
