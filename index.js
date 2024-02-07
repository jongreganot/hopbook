import express from "express";
import { categories } from "./constants/categories.js";
import { blogList } from "./constants/static-data.js";
import bodyParser from "body-parser";
import { blogRepository } from "./repository/blog-repository.js";
import { fileWriter } from "./logic/file-writer.js";
import methodOverride from "method-override";

const app = express();
const port = 3000;
const home = "index.ejs";
const create = "create.ejs";
const view = "view.ejs";
const blogRepo = new blogRepository();
const writer = new fileWriter();

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));
app.use(express.static("views"));
app.use(express.static("logic"));
app.use(express.static("styles"));
app.use(express.static("images"));

var data = {
    blogList: blogList,
    categories: categories,
    activeCategory: "World"
};

var editData = {
    categories: categories,
    blog: undefined
}

app.get("/", (req, res) => {

    prepareHomeData(req.query["category"]);
    res.render(home, { data: data });
});

app.get("/home", (req, res) => {
    prepareHomeData(req.query["category"]);
    res.render(home, { data: data });
});

app.post("/home", (req, res) => {
    let blog = prepareSaveData(req.body);

    let imgBase64 = req.body["imgBase64"];
    if(imgBase64)
        writer.writeFileToImageFolder(imgBase64, blog.image);

    blogRepo.save(blog);

    prepareHomeData(blog.category);
    res.render(home, { data: data });
});

app.get("/edit", (req, res) => {
    let blogId = req.query["blogId"];
    editData.blog = blogRepo.getBlogById(blogId);

    res.render(create, { data: editData });
});

app.get("/create", (req, res) => {
    res.render(create, { data: data });
});

app.get("/view", (req, res) => {
    let blogId = req.query["blogId"];
    let blog = blogRepo.getBlogById(blogId);

    res.render(view, { blog: blog });
});

app.delete("/delete", (req, res) => {
    let blogId = req.body.blogId;
    let category = req.body.category;
    blogRepo.deleteBlog(blogId);

    prepareHomeData(category);
    res.render(home, { data: data });
});

app.listen(port, () => console.log(`Listening on port ${port}.`));

function prepareHomeData(category) {
    if(category == undefined)
        category = "World";
    
    let blogs = blogRepo.getBlogsByCategory(category);

    data.blogList = blogs;
    data.activeCategory = category;
}

function prepareSaveData(requestBody) {
    let title = requestBody["title"];
    let description = requestBody["description"];
    let category = requestBody["category"];
    let bloggerId = requestBody["bloggerId"]
    let fileName = requestBody["image"];
    let oldBlogImg = requestBody["oldBlogImg"];
    let blogId = requestBody["blogId"];

    return {
        id: blogId,
        title: title,
        description: description,
        category: category,
        image: fileName == "" ? oldBlogImg : fileName,
        bloggerId: bloggerId
    }
}