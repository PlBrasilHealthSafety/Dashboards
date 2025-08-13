import React, { useState } from 'react';
import { useCollection, useFirestoreCRUD } from '../../hooks/useFirestore';
import { postService, categoryService, firestoreHelpers } from '../../lib/firestore-collections';
import { queryConstraints } from '../../lib/firestore-services';
import type { Post, Category } from '../../lib/firestore-models';
import { useAuth } from '../../hooks/useAuth';

export const FirestoreExample: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Real-time data hooks
  const { data: posts, loading: postsLoading } = useCollection<Post>('posts', [
    queryConstraints.orderBy('createdAt', 'desc'),
    queryConstraints.limit(5)
  ]);

  const { data: categories, loading: categoriesLoading } = useCollection<Category>('categories');

  // CRUD operations hook
  const { create: createPost, update: updatePost, remove: removePost } = useFirestoreCRUD<Post>('posts');

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runFirestoreTests = async () => {
    if (!user) {
      addTestResult('❌ User not authenticated - please login first');
      return;
    }

    setIsRunningTests(true);
    setTestResults([]);
    addTestResult('🚀 Starting Firestore tests...');

    try {
      // Test 1: Create a category
      addTestResult('📝 Test 1: Creating a category...');
      const categoryId = await categoryService.create({
        name: 'Test Category',
        description: 'A test category created by Firestore example',
        color: '#3B82F6',
        icon: '📝',
        postCount: 0
      });
      addTestResult(`✅ Category created with ID: ${categoryId}`);

      // Test 2: Create a post
      addTestResult('📝 Test 2: Creating a post...');
      const postId = await createPost({
        title: 'Test Post from Firestore Example',
        content: 'This is a test post created to demonstrate Firestore operations.',
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Anonymous',
        category: 'Test Category',
        tags: ['test', 'firestore', 'example'],
        published: true,
        likes: 0,
        views: 0
      });
      addTestResult(`✅ Post created with ID: ${postId}`);

      // Test 3: Read the created post
      addTestResult('📖 Test 3: Reading the created post...');
      const createdPost = await postService.getById(postId);
      if (createdPost) {
        addTestResult(`✅ Post retrieved: "${createdPost.title}"`);
      } else {
        addTestResult('❌ Failed to retrieve created post');
      }

      // Test 4: Update the post
      addTestResult('✏️ Test 4: Updating the post...');
      await updatePost(postId, {
        title: 'Updated Test Post',
        content: 'This post has been updated to test the update operation.',
        tags: ['test', 'firestore', 'example', 'updated']
      });
      addTestResult('✅ Post updated successfully');

      // Test 5: Increment post views using helper
      addTestResult('👀 Test 5: Incrementing post views...');
      await firestoreHelpers.incrementPostViews(postId);
      addTestResult('✅ Post views incremented');

      // Test 6: Query posts by author
      addTestResult('🔍 Test 6: Querying posts by author...');
      const userPosts = await firestoreHelpers.getUserPosts(user.uid);
      addTestResult(`✅ Found ${userPosts.length} posts by current user`);

      // Test 7: Clean up - delete the test post
      addTestResult('🗑️ Test 7: Cleaning up - deleting test post...');
      await removePost(postId);
      addTestResult('✅ Test post deleted');

      // Test 8: Clean up - delete the test category
      addTestResult('🗑️ Test 8: Cleaning up - deleting test category...');
      await categoryService.delete(categoryId);
      addTestResult('✅ Test category deleted');

      addTestResult('🎉 All Firestore tests completed successfully!');

    } catch (error) {
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Firestore test error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Firestore Database Example</h2>
      
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            Please login to test Firestore operations. Authentication is required for database access.
          </p>
        </div>
      )}

      {/* Test Controls */}
      <div className="mb-6">
        <button
          onClick={runFirestoreTests}
          disabled={isRunningTests || !user}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
        >
          {isRunningTests ? 'Running Tests...' : 'Run Firestore Tests'}
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
          <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Posts (Real-time)</h3>
          {postsLoading ? (
            <div className="text-gray-500">Loading posts...</div>
          ) : (
            <div className="space-y-3">
              {posts.length === 0 ? (
                <div className="text-gray-500">No posts found</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      By {post.authorName} • {post.views} views • {post.likes} likes
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories (Real-time)</h3>
          {categoriesLoading ? (
            <div className="text-gray-500">Loading categories...</div>
          ) : (
            <div className="space-y-3">
              {categories.length === 0 ? (
                <div className="text-gray-500">No categories found</div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs text-gray-500">{category.postCount} posts</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">How to use this example:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in with Firebase Authentication</li>
          <li>Click "Run Firestore Tests" to test CRUD operations</li>
          <li>Watch the real-time data sections update automatically</li>
          <li>Check the browser console for detailed logs</li>
          <li>Open Firebase Console to see the data in your Firestore database</li>
        </ol>
      </div>
    </div>
  );
};