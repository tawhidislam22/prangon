export interface Author {
  name: string;
  role: string;
  avatarInitials: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string or Markdown-like structure
  date: string;
  readTime: string;
  category: string;
  author: Author;
  coverGradient: string; // A tailwind gradient class for a placeholder cover
}

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-prangon-1-0",
    title: "Introducing Prangon 1.0: The collaborative workspace for modern teams",
    excerpt: "Today, we're thrilled to announce the general availability of Prangon. We built this platform from the ground up to solve the tenant isolation and permission chaos that plagues modern SaaS.",
    content: `
      <p>After months of development, beta testing, and refining our core architecture, we are incredibly excited to introduce <strong>Prangon 1.0</strong>.</p>
      
      <h2>Why we built Prangon</h2>
      <p>Modern teams use a fragmented array of tools to manage their projects, track tasks, and communicate. While there are many project management tools out there, we noticed a recurring problem for agencies, freelancers, and large organizations: <strong>data isolation</strong>.</p>
      
      <p>When you invite a client to your workspace, how confident are you that they can't see your other clients' projects? With Prangon, we built strict tenant isolation into the foundation of the platform.</p>

      <h2>What's new in 1.0?</h2>
      <ul>
        <li><strong>Strict Role-Based Access Control (RBAC):</strong> Owners, Admins, and Members have distinct boundaries.</li>
        <li><strong>Lightning-fast UI:</strong> Built on Next.js 15 and React 19, interactions feel instantaneous.</li>
        <li><strong>Beautiful Typography:</strong> A distraction-free reading and writing experience.</li>
      </ul>

      <h2>What's next?</h2>
      <p>This is just the beginning. In the coming weeks, we will be rolling out our highly anticipated AI task suggestions and deeper integrations with GitHub and Slack. Stay tuned!</p>
    `,
    date: "October 12, 2024",
    readTime: "4 min read",
    category: "Product Updates",
    author: {
      name: "Alex Rivera",
      role: "CEO & Co-founder",
      avatarInitials: "AR",
    },
    coverGradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    slug: "mastering-tenant-isolation",
    title: "How we architected strict tenant isolation in Prangon",
    excerpt: "A deep dive into our database schema, row-level security, and the middleware that ensures your workspace data never leaks across boundaries.",
    content: `
      <p>Security isn't an afterthought at Prangon; it's the premise of our product. In this engineering deep dive, we'll explain how we keep your workspace data strictly isolated.</p>
      
      <h2>The Problem with Multi-tenancy</h2>
      <p>In a standard multi-tenant application, all users share the same database tables. Usually, a simple <code>WHERE workspace_id = ?</code> clause is the only thing separating your data from a competitor's.</p>
      <p>If a developer forgets that clause in a single API endpoint, data leaks.</p>

      <h2>Our Approach</h2>
      <p>We implemented isolation at multiple layers:</p>
      <ol>
        <li><strong>Application Layer:</strong> Next.js middleware verifies the user's session against the requested workspace slug before the request even hits the route handler.</li>
        <li><strong>Database Layer:</strong> We utilize Row-Level Security (RLS) policies in our database. Even if the application logic fails, the database refuses to return rows that don't belong to the authenticated user's workspace context.</li>
        <li><strong>Edge Authentication:</strong> Using BetterAuth, we issue strict session tokens scoped to specific workspaces.</li>
      </ol>

      <h2>The Result</h2>
      <p>Our customers can sleep soundly knowing their client projects are cryptographically and logically separated. Want to learn more? Check out our <a href="/security">Security page</a>.</p>
    `,
    date: "November 03, 2024",
    readTime: "7 min read",
    category: "Engineering",
    author: {
      name: "Sam Chen",
      role: "Lead Architect",
      avatarInitials: "SC",
    },
    coverGradient: "bg-gradient-to-br from-emerald-400 to-cyan-600",
  },
  {
    slug: "5-tips-for-better-project-management",
    title: "5 tips for managing cross-functional projects without losing your mind",
    excerpt: "Managing designers, engineers, and marketers in a single project can be chaotic. Here are our top 5 strategies for keeping everyone aligned.",
    content: `
      <p>Cross-functional teams are powerful, but they bring a unique set of challenges. When engineers speak in story points, designers in user flows, and marketers in campaign timelines, things get lost in translation.</p>
      
      <h2>1. Define the 'Definition of Done'</h2>
      <p>Before a project starts, everyone must agree on what "Done" means. For an engineer, it might mean the code is merged. For a product manager, it means the feature is live and the documentation is updated.</p>

      <h2>2. Keep status updates async</h2>
      <p>Status meetings are a productivity killer. In Prangon, encourage your team to use task comments and status changes (TODO → In Progress → Done) as their primary communication method.</p>

      <h2>3. Centralize assets</h2>
      <p>Don't leave design files in Figma, copy in Google Docs, and code in GitHub without a central source of truth. Use Prangon task descriptions to link all these disparate assets together.</p>

      <h2>4. Use granular permissions</h2>
      <p>Not everyone needs to edit the project settings. Use Prangon's Admin and Member roles to ensure people have the right level of access.</p>

      <h2>5. Celebrate the wins</h2>
      <p>When a cross-functional project ships, make sure to celebrate as a complete team, not just siloed departments.</p>
    `,
    date: "December 18, 2024",
    readTime: "5 min read",
    category: "Best Practices",
    author: {
      name: "Jamie Doe",
      role: "Product Manager",
      avatarInitials: "JD",
    },
    coverGradient: "bg-gradient-to-br from-amber-400 to-orange-600",
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
