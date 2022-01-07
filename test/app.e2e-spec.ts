import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
   let app: INestApplication;
   let httpServer;

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
         new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
         }),
      );
      await app.init();
      httpServer = app.getHttpServer();
   });

   it('/ (GET)', () => {
      return request(httpServer)
         .get('/')
         .expect(200)
         .expect('Welcome to my Movie API');
   });

   describe('/movies', () => {
      it('GET 200', () => {
         return request(httpServer).get('/movies').expect(200).expect([]);
      });

      it('POST 201', () => {
         return request(httpServer)
            .post('/movies')
            .send({
               title: 'Test',
               year: 2000,
               genres: ['test'],
            })
            .expect(201);
      });

      it('POST 400', () => {
         return request(httpServer)
            .post('/movies')
            .send({
               title: 'Test',
               year: 2000,
               genres: ['test'],
               other: '404',
            })
            .expect(400);
      });
   });

   describe('/movies/:id', () => {
      it('GET 200', () => {
         return request(httpServer).get('/movies/1').expect(200);
      });
      it('GET 404', () => {
         return request(httpServer).get('/movies/999').expect(404);
      });
      it('PATCH 200', () => {
         return request(httpServer)
            .patch('/movies/1')
            .send({
               title: 'Updated Test',
            })
            .expect(200);
      });
      it('DELETE 200', () => {
         return request(httpServer).delete('/movies/1').expect(200);
      });
   });
});
