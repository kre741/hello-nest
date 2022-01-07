import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
   let service: MoviesService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [MoviesService],
      }).compile();

      service = module.get<MoviesService>(MoviesService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   describe('create', () => {
      it('should create a movie', () => {
         const beforeCreate = service.getAll().length;
         service.create({
            title: 'Test Movie',
            year: 2020,
            genres: ['test'],
         });
         const afterCreate = service.getAll().length;
         expect(afterCreate).toEqual(afterCreate);
      });
   });

   describe('getAll', () => {
      it('should return an array', () => {
         const result = service.getAll();
         expect(result).toBeInstanceOf(Array);
      });
   });

   describe('getOne', () => {
      it('should return a movie', () => {
         service.create({
            title: 'Test Movie',
            year: 2020,
            genres: ['test'],
         });
         const movie = service.getOne(1);
         expect(movie).toBeDefined();
      });

      it('should throw 404 error', () => {
         try {
            service.getOne(999);
         } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
         }
      });
   });

   describe('deleteOne', () => {
      it('should deletes a movie', () => {
         service.create({
            title: 'Test Movie',
            year: 2020,
            genres: ['test'],
         });
         const allMovies = service.getAll();
         service.deleteOne(1);
         const afterDelete = service.getAll();
         expect(afterDelete.length).toEqual(allMovies.length - 1);
      });
      it('should return a 404', () => {
         try {
            service.deleteOne(999);
         } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
         }
      });
   });

   describe('update', () => {
      it('should update a movie', () => {
         service.create({
            title: 'Test Movie',
            year: 2020,
            genres: ['test'],
         });
         const updateData = {
            title: 'Update Movie',
            year: 2022,
            genres: ['update'],
         };
         service.update(1, updateData);
         const movie = service.getOne(1);
         expect(movie).toEqual({ id: 1, ...updateData });
      });
      it('should throw a NotFoundException', () => {
         try {
            service.update(999, { title: 'throw 404' });
         } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
         }
      });
   });
});
