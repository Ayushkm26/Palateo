const testBlogCreation = async () => {
    try {
        const blogData = {
            title: 'Test Blog - Creating via Script',
            author: 'Test Author',
            category: 'Test Category',
            tags: ['test', 'blog', 'script'],
            img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
            content: 'This is a test blog content. It needs to be at least 100 characters long to pass validation. This should be enough content to test if the blog creation is working properly in the database.',
            date: new Date().toISOString().split('T')[0]
        };

        console.log('Creating test blog...');
        console.log('Blog data:', JSON.stringify(blogData, null, 2));

        const response = await fetch('http://localhost:5000/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blogData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('\n✅ Blog created successfully!');
            console.log('Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('\n❌ Error creating blog:');
            console.log('Status:', response.status);
            console.log('Message:', data);
        }
        
    } catch (error) {
        console.error('\n❌ Error creating blog:');
        console.error('Message:', error.message);
    }
};

testBlogCreation();
