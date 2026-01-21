import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Settings from '../models/Settings.js';
import TeamMember from '../models/TeamMember.js';
import Post from '../models/Post.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data (optional)
    await Admin.deleteMany({});
    await Settings.deleteMany({});
    await TeamMember.deleteMany({});
    await Post.deleteMany({});

    // Create default admin using environment variables
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL || 'admin@talkcavas.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      name: process.env.ADMIN_NAME || 'Admin User',
      role: 'admin',
    });
    await admin.save();
    console.log('✓ Default admin created with email:', admin.email);

    // Create default settings
    const settings = new Settings({
      logo: '',
      heroImage: '',
      whatsappLink: 'https://wa.me/2347071016230',
      instagramLink: 'https://instagram.com/talkcavas',
      aboutContent: '<p>Welcome to Talk Canvas. We are dedicated to creating beautiful art and interior décor solutions that transform spaces into inspiring environments. With a team of passionate artists and designers, we bring creativity and elegance to every project.</p>',
      maintenanceMode: false,
    });
    await settings.save();
    console.log('✓ Default settings created with WhatsApp: +2347071016230');

    // Create sample team members
    const teamMembers = [
      {
        name: 'John Doe',
        role: 'Founder & Creative Director',
        bio: 'With 10 years of experience in art and design',
        displayOrder: 1,
      },
      {
        name: 'Jane Smith',
        role: 'Interior Designer',
        bio: 'Specialist in contemporary décor',
        displayOrder: 2,
      },
      {
        name: 'Mike Johnson',
        role: 'Canvas Artist',
        bio: 'Master of mixed media and abstract art',
        displayOrder: 3,
      },
    ];

    await TeamMember.insertMany(teamMembers);
    console.log('✓ Sample team members created');

    // Create sample posts
    const posts = [
      {
        title: 'Modern Living Room Design',
        description: 'Transform your living space with contemporary art and décor',
        category: 'gallery',
        featured: true,
        displayOrder: 1,
        published: true,
      },
      {
        title: 'Latest Art Exhibition',
        description: 'Join us for our latest collection of contemporary artworks',
        category: 'exhibition',
        featured: true,
        displayOrder: 2,
        published: true,
      },
      {
        title: 'Interior Décor Trends 2024',
        description: 'Discover the hottest trends in interior design this year',
        category: 'blog',
        featured: false,
        displayOrder: 3,
        published: true,
      },
    ];

    await Post.insertMany(posts);
    console.log('✓ Sample posts created');

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
