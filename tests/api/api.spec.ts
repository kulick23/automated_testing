import { test, expect } from '@playwright/test';
import axios from 'axios';

test.describe('API Tests', () => {
    test('GET request - should return a non-empty array of posts', async ({}) => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        expect(response.data.length).toBeGreaterThan(0);
    });

    test('GET request with parameter - should return comments with postId equal to parameter', async ({}) => {
        const parameter = 1;
        const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${parameter}`);
        expect(response.data.length).toBeGreaterThan(0);
        response.data.forEach((comment: any) => {
            expect(comment.postId).toBe(parameter);
        });
    });

    test('POST request - should create a new post and return it with an id', async ({}) => {
        const postData = { title: 'test title', body: 'test body', userId: 1 };
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', postData);
        expect(response.data).toEqual({ id: 101, ...postData });
    });

    test('GraphQL запрос: выбор эпизодов с подстрокой "Rick"', async ({ page }) => {
        const query = `
          query {
            episodes(filter: { name: "Rick" }) {
              results {
                name
              }
            }
          }
        `;
      
        const response = await page.evaluate(async (query) => {
          const res = await fetch('https://rickandmortyapi.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          });
          const responseData = await res.json();
          return { status: res.status, data: responseData };
        }, query);
      
        expect(response.status).toBe(200); 
      
        const episodes = response.data.data.episodes.results;
      
        console.log('Эпизоды:', episodes); 
      
        expect(episodes.length).toBeGreaterThan(0); 
      
        
        episodes.forEach((episode: { name: string }) => {
          expect(episode.name.toLowerCase()).toContain('rick'); 
        });
      });
});