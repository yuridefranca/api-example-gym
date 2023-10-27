import { describe, before, after, it } from 'node:test';
import { deepStrictEqual, ok, strictEqual } from 'node:assert';
import * as fs from 'node:fs/promises';

const BASE_URL = 'http://localhost:80';

describe('API', () => {
    let _server = {};

    before(async () => {
        _server = (await import('./api.js')).app;
        await new Promise((resolve) => _server.once('listening', resolve()));
    });

    after((done) => _server.close(done));

    describe('POST /exercises', () => {
        it('should return 400 status code if body is empty', async () => {
            const response = await fetch(`${BASE_URL}/exercises`, {
                method: 'POST',
                body: JSON.stringify({}),
            });
            const parsedResponse = await response.json();

            strictEqual(response.status, 400);
            deepStrictEqual(parsedResponse, {
                success: false,
                message: 'The body must not be empty!',
            });
        });

        it('should return 422 status code if body is missing some required field', async () => {
            const response = await fetch(`${BASE_URL}/exercises`, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'any-name',
                    description: 'any-description',
                }),
            });
            const parsedResponse = await response.json();

            strictEqual(response.status, 422);
            deepStrictEqual(parsedResponse, {
                success: false,
                message: 'The fields "name", "reps" and "sets" are required!',
            });
        });

        it('should return 201 status code if body is valid', async () => {
            const response = await fetch(`${BASE_URL}/exercises`, {
                method: 'POST',
                body: JSON.stringify({
                    description: null,
                    load: null,
                    name: 'any-name',
                    reps: 10,
                    sets: 3,
                }),
            });
            const parsedResponse = await response.json();

            strictEqual(response.status, 201);
            deepStrictEqual(parsedResponse, {
                success: true,
                data: {
                    description: null,
                    id: parsedResponse.data.id,
                    load: null,
                    name: 'any-name',
                    reps: 10,
                    sets: 3,
                },
            });

            // removing inserted exercise
            {
                const exercises = JSON.parse(
                    await fs.readFile('./exercises.json')
                );

                await fs.writeFile(
                    './exercises.json',
                    JSON.stringify(
                        exercises.filter(
                            (exercise) => exercise.id !== parsedResponse.data.id
                        )
                    )
                );
            }
        });
    });

    describe('GET /exercises', () => {
        it('should return 200 status code if body is valid', async () => {
            const response = await fetch(`${BASE_URL}/exercises`, {
                method: 'GET',
            });
            const parsedResponse = await response.json();

            strictEqual(response.status, 200);
            ok(Array.isArray(parsedResponse.data));
        });
    });

    describe('GET /exercises/:id', () => {
        it('should return 404 status code if does not exists an user with the provided id', async () => {
            const response = await fetch(
                `${BASE_URL}/exercises/unexistent-id`,
                {
                    method: 'GET',
                }
            );
            const parsedResponse = await response.json();

            strictEqual(response.status, 404);
            deepStrictEqual(parsedResponse, {
                success: false,
                message: 'Exercise not found!',
            });
        });

        it('should return 200 status code if body is valid', async () => {
            // seeding the "database"
            {
                const exercise = {
                    description: 'any-description',
                    id: 'any-id',
                    load: 1,
                    name: 'any-name',
                    reps: 1,
                    sets: 1,
                };

                const exercises = JSON.parse(
                    await fs.readFile('./exercises.json')
                );
                exercises.push(exercise);

                await fs.writeFile(
                    './exercises.json',
                    JSON.stringify(exercises)
                );
            }

            const response = await fetch(`${BASE_URL}/exercises/any-id`, {
                method: 'GET',
            });
            const parsedResponse = await response.json();

            strictEqual(response.status, 200);
            deepStrictEqual(parsedResponse, {
                success: true,
                data: {
                    description: 'any-description',
                    id: 'any-id',
                    load: 1,
                    name: 'any-name',
                    reps: 1,
                    sets: 1,
                },
            });

            // removing the "database" seed
            {
                const exercises = JSON.parse(
                    await fs.readFile('./exercises.json')
                );

                await fs.writeFile(
                    './exercises.json',
                    JSON.stringify(
                        exercises.filter((exercise) => exercise.id !== 'any-id')
                    )
                );
            }
        });
    });

    describe('PATCH /exercises/:id', () => {
        it('should return 404 status code if does not exists an user with the provided id', async () => {
            const response = await fetch(
                `${BASE_URL}/exercises/unexistent-id`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name: 'new-name',
                    }),
                }
            );

            const parsedResponse = await response.json();

            strictEqual(response.status, 404);
            deepStrictEqual(parsedResponse, {
                success: false,
                message: 'Exercise not found!',
            });
        });

        it('should return 400 status code if body is empty', async () => {
            const response = await fetch(
                `${BASE_URL}/exercises/b26e67ee-0a43-4c3f-8aea-a1179427faf7`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({}),
                }
            );

            const parsedResponse = await response.json();

            strictEqual(response.status, 400);
            deepStrictEqual(parsedResponse, {
                success: false,
                message: 'The body must not be empty!',
            });
        });

        it('should return 200 status code if body is valid', async () => {
            // seeding the "database"
            {
                const exercise = {
                    description: 'any-description',
                    id: 'any-id',
                    load: 1,
                    name: 'any-name',
                    reps: 1,
                    sets: 1,
                };

                const exercises = JSON.parse(
                    await fs.readFile('./exercises.json')
                );
                exercises.push(exercise);

                await fs.writeFile(
                    './exercises.json',
                    JSON.stringify(exercises)
                );
            }

            const response = await fetch(`${BASE_URL}/exercises/any-id`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: 'new-name',
                    description: 'new-description',
                }),
            });

            const parsedResponse = await response.json();

            strictEqual(response.status, 200);
            deepStrictEqual(parsedResponse, {
                success: true,
                data: {
                    description: 'new-description',
                    id: 'any-id',
                    load: 1,
                    name: 'new-name',
                    reps: 1,
                    sets: 1,
                },
            });

            // removing the "database" seed
            {
                const exercises = JSON.parse(
                    await fs.readFile('./exercises.json')
                );

                await fs.writeFile(
                    './exercises.json',
                    JSON.stringify(
                        exercises.filter((exercise) => exercise.id !== 'any-id')
                    )
                );
            }
        });
    });

    describe('DELETE /exercises/:id', () => {
        it('should return 404 status code if does not exists an user with the provided id', async () => {
            const response = await fetch(
                `${BASE_URL}/exercises/unexistent-id`,
                {
                    method: 'DELETE',
                }
            );

            const parsedResponse = await response.json();

            strictEqual(response.status, 404);
            deepStrictEqual(parsedResponse, {
                success: false,
                message: 'Exercise not found!',
            });
        });

        it('should return 204 status code if body is valid', async () => {
            // seeding the "database"
            {
                const exercise = {
                    description: 'any-description',
                    id: 'any-id',
                    load: 1,
                    name: 'any-name',
                    reps: 1,
                    sets: 1,
                };

                const exercises = JSON.parse(
                    await fs.readFile('./exercises.json')
                );
                exercises.push(exercise);

                await fs.writeFile(
                    './exercises.json',
                    JSON.stringify(exercises)
                );
            }

            const response = await fetch(`${BASE_URL}/exercises/any-id`, {
                method: 'DELETE',
            });

            strictEqual(response.status, 204);
        });
    });

    it("should return 404 status code if doesn't match any route", async () => {
        const response = await fetch(`${BASE_URL}/unexistent`, {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const parsedResponse = await response.json();

        strictEqual(response.status, 404);
        deepStrictEqual(parsedResponse, {
            success: false,
            message: 'Not found',
        });
    });
});
