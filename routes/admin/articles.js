const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const {Op} = require('sequelize')

/* GET articles listing. */
router.get("/", async function (req, res, next) {
  try {
    const query = req.query;

    const currentPage = Math.abs(Number(query.currentPage))||1

    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const offset = (currentPage-1)*pageSize

    const condition = {
      order: [["id", "DESC"]],
      limit:pageSize,
      offset:offset
    };

    //Search
    if(query.title){
      condition.where={
        title:{
          [Op.like]:`%${query.title}%`
        }
      }
    }
    const {count,rows} = await Article.findAndCountAll(condition);
    res.json({
      status: true,
      message: "Get Articles List Successfully",
      data: {
        articles:rows,
        total:count,
        currentPage,
        pageSize
      },
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Some error happen",
      errors: [error.message],
    });
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (article) {
      res.json({
        status: true,
        message: "Get Article details Successfully",
        data: {
          article,
        },
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Article not exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Some error happen",
      errors: [error.message],
    });
  }
});

//create new article
router.post('/',  async function (req, res, next){
  try{
    const body = filterBody(req)

    const article = await Article.create(body)
    res.status(201).json({
      status: true,
      message: "create article successfully",
      data:article,
    });

  }catch(error){
    res.status(500).json({
      status: false,
      message: "create article fail",
      errors: [error.message],
    });

  }
  
})

router.delete('/:id', async function (req, res, next){
  try {
    const {id} = req.params
    const article = await Article.findByPk(id)
    if(article){
      await article.destroy()
      res.json({
        status: true,
        message: "Delete Article Successfully",
       
      });

    }else{
      res.status(404).json({
        status: false,
        message: "Article not exist",
      });
    }
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "delete article fail",
      errors: [error.message],
    });
  }

})

router.put('/:id', async function (req, res, next){
  try {
    const {id} = req.params
    const article  = await Article.findByPk(id);
    const body = filterBody(req)
    if(article){
      await article.update(body)
      res.json({
        status: true,
        message: "update article successfully",
        data:article
      });

    }else{
      res.status(404).json({
        status: false,
        message: "Article doesn't exist",
      });
    }
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Update article fail",
      errors: [error.message],
    });
  }
})

function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content
  };
}

module.exports = router;
