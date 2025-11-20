// Test script to check API response
async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/properties?limit=10');
    const data = await response.json();
    
    console.log('=== API Response Check ===\n');
    console.log(`Total properties returned: ${data.length}\n`);
    
    // Check if all imageUrls are the same
    const imageUrls = data.map(p => p.imageUrl);
    const uniqueImageUrls = [...new Set(imageUrls)];
    
    console.log(`Unique image URLs: ${uniqueImageUrls.length} out of ${imageUrls.length}`);
    console.log('');
    
    data.slice(0, 5).forEach((prop, index) => {
      console.log(`Property ${index + 1}: ${prop.name}`);
      console.log(`  imageUrl: ${prop.imageUrl}`);
      console.log('');
    });
    
    if (uniqueImageUrls.length === 1) {
      console.log('⚠️  WARNING: All properties have the SAME imageUrl!');
      console.log(`Common URL: ${uniqueImageUrls[0]}`);
    } else {
      console.log('✅ Properties have different imageUrls');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
