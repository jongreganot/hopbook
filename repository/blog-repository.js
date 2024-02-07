import { blogList } from "../constants/static-data.js";

export class blogRepository {
    
    constructor() {
    }

    getBlogById(id) {
        return blogList.filter(b => b.id == id)[0];
    }

    getBlogsByCategory(category) {
        return blogList.filter(b => b.category == category);
    }

    deleteBlog(id) {
        let index = blogList.findIndex(b => b.id == id)
        blogList.splice(index, 1);
    }

    save(blog) {
        if (blogList.find(b => b.id == blog.id)) {
            let index = blogList.findIndex(b => b.id == blog.id);
            blogList[index] = blog;
        }
        else {
            blog.id = blogList.length + 1;
            blogList.push(blog);
        }
    }
}