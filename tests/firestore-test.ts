import { 
  postService, 
  categoryService, 
  firestoreHelpers 
} from '../src/lib/firestore-collections';
import { queryConstraints } from '../src/lib/firestore-services';

// Test function to verify Firestore operations
export async function testFirestoreOperations(userId: string, userEmail: string) {
  console.log('🚀 Starting Firestore operations test...');
  
  try {
    // Test 1: Create a test category
    console.log('📝 Creating test category...');
    const categoryId = await categoryService.create({
      name: 'Test Category',
      description: 'A category created for testing purposes',
      color: '#10B981',
      icon: '🧪',
      postCount: 0
    });
    console.log('✅ Category created:', categoryId);

    // Test 2: Create a test post
    console.log('📝 Creating test post...');
    const postId = await postService.create({
      title: 'Test Post for Firestore',
      content: 'This is a test post to verify Firestore CRUD operations are working correctly.',
      authorId: userId,
      authorName: userEmail,
      category: 'Test Category',
      tags: ['test', 'firestore', 'crud'],
      published: true,
      likes: 0,
      views: 0
    });
    console.log('✅ Post created:', postId);

    // Test 3: Read the created post
    console.log('📖 Reading created post...');
    const post = await postService.getById(postId);
    console.log('✅ Post retrieved:', post?.title);

    // Test 4: Update the post
    console.log('✏️ Updating post...');
    await postService.update(postId, {
      title: 'Updated Test Post',
      content: 'This post has been updated to test the update operation.',
      likes: 5
    });
    console.log('✅ Post updated');

    // Test 5: Query posts
    console.log('🔍 Querying posts...');
    const posts = await postService.getAll([
      queryConstraints.where('authorId', '==', userId),
      queryConstraints.orderBy('createdAt', 'desc')
    ]);
    console.log('✅ Found posts:', posts.length);

    // Test 6: Test helper functions
    console.log('🔧 Testing helper functions...');
    await firestoreHelpers.incrementPostViews(postId);
    await firestoreHelpers.incrementPostLikes(postId);
    console.log('✅ Helper functions tested');

    // Test 7: Clean up - delete test data
    console.log('🗑️ Cleaning up test data...');
    await postService.delete(postId);
    await categoryService.delete(categoryId);
    console.log('✅ Test data cleaned up');

    console.log('🎉 All Firestore tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
}

// Function to initialize sample data (optional)
export async function initializeSampleData() {
  console.log('🌱 Initializing sample data...');
  
  try {
    // Create sample categories
    const categories = [
      {
        name: 'Technology',
        description: 'Posts about technology and programming',
        color: '#3B82F6',
        icon: '💻',
        postCount: 0
      },
      {
        name: 'Design',
        description: 'UI/UX design and creative content',
        color: '#8B5CF6',
        icon: '🎨',
        postCount: 0
      },
      {
        name: 'Business',
        description: 'Business insights and entrepreneurship',
        color: '#10B981',
        icon: '💼',
        postCount: 0
      }
    ];

    for (const category of categories) {
      await categoryService.create(category);
    }

    console.log('✅ Sample categories created');
    return true;

  } catch (error) {
    console.error('❌ Failed to initialize sample data:', error);
    return false;
  }
}