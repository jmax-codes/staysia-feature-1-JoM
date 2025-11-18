import { db } from '@/db';

async function clearPropertyImages() {
  try {
    console.log('🔍 Checking property_images table...');
    
    const count = await db.propertyImage.count();
    console.log(`Found ${count} records in property_images table`);
    
    if (count > 0) {
      // Show sample
      const sample = await db.propertyImage.findMany({ take: 3 });
      console.log('\nSample records:', JSON.stringify(sample, null, 2));
      
      // Delete all property images so the API uses the JSON field instead
      console.log('\n🗑️  Deleting all property_images records...');
      const deleted = await db.propertyImage.deleteMany();
      console.log(`✅ Deleted ${deleted.count} records`);
      console.log('\n✨ Now the API will use the images from the properties.images JSON field');
    } else {
      console.log('✅ No records in property_images table - API will use properties.images JSON field');
    }
    
  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  }
}

clearPropertyImages();
