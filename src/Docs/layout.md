# Project layout/structure

This document describes the project layout and project structure

---

### Project structure:

```typescript
└───web
    │   .gitignore
    │   LICENSE
    │   README.md
    │
    ├───Docs
    │       database.sql
    │       ErrorFormat.md
    │       FunctionFormat.md
    │       layout.md
    │       NamingConventions.md
    │       StandardizedLogging.md
    │
    ├───public
    │   │
    │   ├───components
    │   ├───images
    │   │   ├───news
    │   │   └───products
    │   └───pages
    │       ├───about
    │       ├───cart
    │       ├───product
    │       └───terms
    └───src
        ├───dbscripts
        └───utils
```

---

### Description of each of the directories:

``` web ``` is the main project directory.

``` public ``` is the public directory where all the public files are located.

``` public/components ``` is where the ejs components will be located.

``` public/images ``` is where all the images will be stored

``` public/images/news ``` Is where the news images used for the banner will be stored

``` public/images/products ``` Is where the unique product images will be stored

``` public/pages ``` is where each of the individual html/css/js pages will be stored in sub directories.

``` src/ ``` will contain the server scripts like the main runtime and handling of back-end

``` src/dbscripts ``` will contain database related scripts like generating and using testdata

``` src/utils ``` will contain general util files for use in other back-end services