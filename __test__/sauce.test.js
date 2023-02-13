const request = require('supertest');
const { sauceRoutes } = require('./sauceRoutes');
const { sauceCollection } = require('../models/index');

describe('Sauce routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(sauceRoutes);
    });

    describe('GET /sauce', () => {
        it('returns a list of all sauces', async () => {
            const mockSauces = [                { name: 'Hot Sauce', group: 'Spicy' },                { name: 'BBQ Sauce', group: 'Smoky' },            ];
            sauceCollection.read = jest.fn().mockResolvedValue(mockSauces);

            const response = await request(app).get('/sauce');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockSauces);
            expect(sauceCollection.read).toHaveBeenCalled();
        });
    });

    describe('GET /sauce/:id', () => {
        it('returns a single sauce when it exists', async () => {
            const mockSauce = { name: 'Hot Sauce', group: 'Spicy' };
            sauceCollection.read = jest.fn().mockResolvedValue(mockSauce);

            const response = await request(app).get('/sauce/123');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockSauce);
            expect(sauceCollection.read).toHaveBeenCalledWith('123');
        });

        it('returns a 404 error when the sauce does not exist', async () => {
            sauceCollection.read = jest.fn().mockResolvedValue(null);

            const response = await request(app).get('/sauce/123');

            expect(response.statusCode).toBe(404);
            expect(sauceCollection.read).toHaveBeenCalledWith('123');
        });
    });

    describe('POST /sauce', () => {
        it('creates a new sauce', async () => {
            const mockSauce = { name: 'Hot Sauce', group: 'Spicy' };
            sauceCollection.create = jest.fn().mockResolvedValue(mockSauce);

            const response = await request(app)
                .post('/sauce')
                .send({ name: 'Hot Sauce', group: 'Spicy' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockSauce);
            expect(sauceCollection.create).toHaveBeenCalledWith({
                name: 'Hot Sauce',
                group: 'Spicy',
            });
        });
    });

    describe('PUT /food/:id', () => {
        it('updates a food item', async () => {
          foodCollection.update = jest.fn().mockResolvedValue({ name: 'banana', group: 'fruit' })
    
          const response = await request(app)
            .put('/food/1')
            .send({ name: 'Hot Sauce', group: 'Spicy' })
    
          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({ name: 'Hot Sauce', group: 'Spicy' })
        })
    
        it('responds with a 404 error if the food item does not exist', async () => {
          foodCollection.update = jest.fn().mockResolvedValue(null)
    
          const response = await request(app)
            .put('/food/1')
            .send({ name: 'Hot Sauce', group: 'Spicy' })
    
          expect(response.statusCode).toBe(404)
        })
      })
    })