const { response } = require('express')
const express=require('express')
const morgan = require('morgan')
const app=express()

app.use(express.json())

let persons= [
    {
      "name": "b",
      "number": "3",
      "id": 2
    },
    {
      "name": "c",
      "number": "5",
      "id": 3
    },
    {
      "name": "e",
      "number": "1",
      "id": 4
    }
]
morgan.token('body', function(req, res, param) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :req[content-length]  - :response-time ms :body'))

app.get('/info',(req,res)=>{
    res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
})

app.get('/api/persons',(req,res)=>{
    res.status(200).json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
    const id= Number(req.params.id)
    const person=persons.find(pers=>pers.id===id)
    if(person){
        res.status(200).json(person)
    }
    else res.status(404).end()
})

app.delete('/api/persons/:id',(req,res)=>{
    const id= Number(req.params.id)
    persons=persons.filter(pers=>pers.id!==id)
    res.status(204).end()
})

const generateId=()=>{
    return Math.random()*1000
}

const getFindName=(name)=>{
    return persons.find(pers=>pers.name===name)
}

app.post('/api/persons',(req,res)=>{
    const {name,number}= req.body

    if(!name){
        return res.status(404).json({'error':'name is required'})
    }

    if(getFindName(name)){
        return res.status(404).json({'error':'name must be unique'})
    }
    
    if(!number){
        return res.status(404).json({'error':'number is required'})
    }

    const person={
        name,
        number,
        id:generateId()
    }

    persons=persons.concat(person)
    res.json(person)
})

PORT=3001
app.listen(PORT,()=>{
    console.log(`Servidor Corriendo en Puerto: ${PORT}`)
})