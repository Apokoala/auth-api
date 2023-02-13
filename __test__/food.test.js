const request = require('supertest')
const { foodCollection } = require('../src/models/index')
const { foodRoutes } = require('../src/routes/food.route')

describe('Food Routes', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(foodRoutes)
  })

  describe('GET /food', () => {
    it('responds with a list of all foods', async () => {
      foodCollection.read = jest.fn().mockResolvedValue([
        { name: 'apple', group: 'fruit' },
        { name: 'carrot', group: 'vegetable' },
      ])

      const response = await request(app).get('/food')

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual([
        { name: 'apple', group: 'fruit' },
        { name: 'carrot', group: 'vegetable' },
      ])
    })
  })

  describe('GET /food/:id', () => {
    it('responds with a single food item', async () => {
      foodCollection.read = jest.fn().mockResolvedValue({ name: 'apple', group: 'fruit' })

      const response = await request(app).get('/food/1')

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ name: 'apple', group: 'fruit' })
    })

    it('responds with a 404 error if the food item does not exist', async () => {
      foodCollection.read = jest.fn().mockResolvedValue(null)

      const response = await request(app).get('/food/1')

      expect(response.statusCode).toBe(404)
    })
  })

  describe('DELETE /food/:id', () => {
    it('deletes a food item', async () => {
      foodCollection.delete = jest.fn().mockResolvedValue({ name: 'apple', group: 'fruit' })

      const response = await request(app).delete('/food/1')

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({})
    })

    it('responds with a 404 error if the food item does not exist', async () => {
      foodCollection.delete = jest.fn().mockResolvedValue(null)

      const response = await request(app).delete('/food/1')

      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /food', () => {
    it('creates a new food item', async () => {
      foodCollection.create = jest.fn().mockResolvedValue({ name: 'apple', group: 'fruit' })

      const response = await request(app)
        .post('/food')
        .send({ name: 'apple', group: 'fruit' })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ name: 'apple', group: 'fruit' })
    })
  })

  describe('PUT /food/:id', () => {
    it('updates a food item', async () => {
      foodCollection.update = jest.fn().mockResolvedValue({ name: 'banana', group: 'fruit' })

      const response = await request(app)
        .put('/food/1')
        .send({ name: 'banana', group: 'fruit' })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ name: 'banana', group: 'fruit' })
    })

    it('responds with a 404 error if the food item does not exist', async () => {
      foodCollection.update = jest.fn().mockResolvedValue(null)

      const response = await request(app)
        .put('/food/1')
        .send({ name: 'banana', group: 'fruit' })

      expect(response.statusCode).toBe(404)
    })
  })
})