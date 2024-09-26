const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  console.log('GET todos listing..ff.');
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let added = parseInt(await redis.getAsync("added_todos"));
  if (isNaN(added)){
    await redis.setAsync("added_todos", "1");  
  }else{
    await redis.setAsync("added_todos", added + 1);
  }
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  console.log('New todos:', req.body);
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  //res.send(req.todo);
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  console.log('Request Id:', req.params.id);
  res.send(req.todo); 
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  //res.sendStatus(405); // Implement this
  console.log('Request Id:', req.params.id);
  console.log('Request Id:', req.todo.id);
  
  const todo = await Todo.updateOne({
      _id: req.todo.id
    },
    {
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
