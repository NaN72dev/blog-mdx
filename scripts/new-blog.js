#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function formatDate(date) {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatFullDate(date) {
  return date.toISOString().split("T")[0];
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateBlogTemplate(metadata) {
  return `export const metadata = {
    title: "${metadata.title}",
    publishDate: "${metadata.publishDate}",
    description: "${metadata.description}",
    category: "${metadata.category}",
    cover_image: "${metadata.coverImage}",
};

<img src={metadata.cover_image} alt="cover image: ${metadata.title}"/>

## Introduction

Write your introduction here. This is where you'll hook your readers and give them a preview of what they'll learn.

## Main Content

### Section 1

Add your main content here. You can use:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- \`inline code\` for code snippets
- [Links](https://example.com) to external resources

### Section 2

You can add code blocks like this:

\`\`\`javascript
function example() {
  console.log("Hello, world!");
}
\`\`\`

### Section 3

Add more sections as needed. You can include:

1. Numbered lists
2. For step-by-step instructions
3. Or ordered content

## Conclusion

Wrap up your blog post with key takeaways and next steps for your readers.

---

*Published on ${metadata.publishDate}*
`;
}

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("🚀 Blog Post Generator\n");

  try {
    const title = await promptUser("Enter blog title: ");
    if (!title) {
      console.log("❌ Title is required!");
      process.exit(1);
    }

    const description =
      (await promptUser("Enter blog description: ")) || "A new blog post";
    const category =
      (await promptUser("Enter category (default: General): ")) || "General";
    const coverImage =
      (await promptUser("Enter cover image URL (optional): ")) ||
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

    const now = new Date();
    const datePrefix = formatDate(now);
    const slug = slugify(title);
    const fileName = `${datePrefix}-${slug}.mdx`;
    const filePath = path.join(process.cwd(), "content", "blogs", fileName);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`❌ File ${fileName} already exists!`);
      process.exit(1);
    }

    const metadata = {
      title,
      publishDate: formatFullDate(now),
      description,
      category,
      coverImage,
    };

    const blogContent = generateBlogTemplate(metadata);

    // Ensure the blogs directory exists
    const blogsDir = path.join(process.cwd(), "content", "blogs");
    if (!fs.existsSync(blogsDir)) {
      fs.mkdirSync(blogsDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePath, blogContent);

    console.log("\n✅ Blog post created successfully!");
    console.log(`📁 File: ${fileName}`);
    console.log(`📍 Path: ${filePath}`);
    console.log("\n📝 You can now edit the file and add your content!");
  } catch (error) {
    console.error("❌ Error creating blog post:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
