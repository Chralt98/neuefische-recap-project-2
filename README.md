# neuefische-recap-project-2

## Recap Project 2 - Trail Guide
### Learning Objectives

- Combine routing, middleware, `MVC`, `Nunjucks`, and `SQLite` into a single working application
- Serve `HTML` pages and `JSON` responses from the same `Express` app and the same model layer
- Use a one-to-many relationship in `SQLite` and read it back with an `INNER JOIN`
- Protect write endpoints on a public `API` with a header-based key check
- Style a semantic `HTML` site with `pico.css` and no custom utility classes

### Overview

Up to now, each backend session has focused on one layer at a time: `HTTP` and `Express`, then middleware, then `MVC`, then templates, then `SQL`. This recap project is where the layers meet. You build one application that uses all of them, and you do it without a tutorial walking you line by line through each step.

The project is a small directory of hiking trails called `Trail Guide`. Visitors browse trails on a public website. An admin user manages the catalog through a separate set of routes with `HTML` forms. External developers can read and write data through a `JSON API` that lives at `/api`. All three surfaces share the same `Express` app, the same `SQLite` database, and the same model functions. Only the controllers and the response format change.

The data model has two tables. A `regions` table holds the area each trail belongs to, like `Bavarian Alps` or `Scottish Highlands`. A `trails` table holds individual trails and references its region through a foreign key. This one-to-many relationship is what gives you something to join: every trail page and every `API` response that returns a trail also includes the region’s name and country.

Styling is handled by `pico.css`, a class-less `CSS` framework. You add it once via a `CDN` link in your base template, then write plain semantic `HTML` such as `<header>`, `<nav>`, `<article>`, `<form>`, and `<table>`, and `pico` styles it for you. There is no design work to do beyond writing correct markup.

The project is broken into four chunks: setup and database, public website, admin panel, public `API`. Tackle them in order. Each part depends on the previous one being in place.

## Backend SQL Advanced - Challenges
### Extend Your Express Project with Full CRUD

Add create, update, and delete operations to the `Express` project from the previous session.

### Requirements

- Add a `createBlogEntry` model function that runs an `INSERT` and returns the new entry's `ID` via `this.lastID`
- Add an `updateBlogEntry` model function that runs an `UPDATE` scoped to a specific `ID`
- Add a `deleteBlogEntry` model function that runs a `DELETE` scoped to a specific `ID`
- Add `POST`, `PUT`, and `DELETE` route handlers that call the corresponding model functions
- Use parameterized queries, `?` placeholders, for all values. Do not interpolate values directly into the `SQL` string
- Test each route with a `REST` client, for example `Bruno` or `curl`, and verify the changes in `DB Browser`

### Optional: Authors Table and `JOIN`

- Create a separate `authors` table with at least `id` and `name` columns
- Add an `author_id` foreign key column to your `blog_entries` table
- Populate both tables with sample data
- Write a `SELECT` query with a `JOIN` that returns each blog entry alongside the author's name
- Expose a new `GET` route that returns the joined result
- Add a user interface to manage authors: create, edit, and delete author records