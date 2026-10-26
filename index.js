import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import blogs from "./data/blogs.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(methodOverride("_method"));

//Landing page
app.get("/", (req, res) => {
    res.render("index.ejs", {
        totalBlogs: blogs.length
    });
});

//Get route for all categories
app.get("/all_topics", (req, res) => {
    res.render("topics.ejs");
});

//Get route for all blogs
app.get("/blogs", (req, res) => {
    res.render("blogs.ejs", {  allBlogs: blogs });
});

//routes for create blog
app.get("/blogs/create", (req, res) => {
    res.render("newForm.ejs");
});

app.post("/blogs/new_post", (req, res) => {
    const { title, author, category, content } = req.body;
    const allBlogsCat = blogs.filter((b) => b.category === category);
    const counter = allBlogsCat.length + 1;
    const newBlogId = `${category}-00${counter}`;
    const newBlog = {
        id: newBlogId,
        title,
        author,
        category,
        content: `<p>${content}</p>`,
     };
    blogs.push(newBlog);

    res.redirect("/blogs");
});

//Get route for random blog
app.get("/blogs/random", (req, res) => {
    const randomBlog = blogs[Math.floor(Math.random() * blogs.length)];

    if(!randomBlog) {
        return res.send("No blogs Available");
    };

    res.redirect(`/blogs/${randomBlog.id}`);
});

//get route for blog with id
app.get("/blogs/:id", (req, res) => {
     const blogId = req.params.id;
     const blog = blogs.find((b) => b.id === blogId);

     if(!blog) {
        return res.send("Blog not Found.")
     };
     
     res.render("blog.ejs", { blog })
});

//routes for blog edit i.e get and patch
app.get("/blogs/:id/edit", (req, res) => {
    const blogId = req.params.id;
    const blog = blogs.find((b) => b.id === blogId);

    if(!blog) {
        return res.send("Blog not found");
    };

    res.render("editForm.ejs", { blog });
});

app.patch("/blogs/:id", (req, res) => {
    const blogId = req.params.id;
    const blog = blogs.find((b) => b.id === blogId);

    if(!blog) {
        return res.send("Blog not found");
    };
    const { title, author, category, content } = req.body;
    blog.title = title;
    blog.author = author;
    blog.category = category;
    blog.content = `<p>${content}</p>`;

    res.redirect(`/blogs/${blog.id}`);
});

//route for deleting blog
app.delete("/blogs/:id", (req, res) => {
    const blogId = req.params.id;
    const index = blogs.findIndex((b) => b.id === blogId);

    if(index === -1) return res.send("Blog not found");

    blogs.splice(index, 1);

    res.redirect("/");
});

//route for category listing
app.get("/categories/:name", (req, res) => {
    const blogCategory = req.params.name;
    const newBlogs = blogs.filter((b) => b.category === blogCategory);

    if(newBlogs.length === 0) {
        return res.send(`No Blogs fall under ${blogCategory} category.`);
    };

    res.render("blogs.ejs", { allBlogs: newBlogs, category: blogCategory });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});