import { createServer } from 'node:http';
import crypto from 'node:crypto';
import * as fs from 'node:fs/promises';

async function setHeaders(res) {
    // setting CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // setting response headers
    res.setHeader('Content-Type', 'application/json');
}

async function createExercise(body, res) {
    const { description, load, name, reps, sets } = body;
    if (
        Object.keys({ description, load, name, reps, sets }).filter(
            (key) => body[key] === undefined
        ).length === 5
    ) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                message: 'The body must not be empty!',
            })
        );
        return;
    }

    if (!name || !reps || !sets) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                message: 'The fields "name", "reps" and "sets" are required!',
            })
        );
        return;
    }

    const exercise = {
        description: description ?? null,
        id: crypto.randomUUID(),
        load: load ?? null,
        name,
        reps,
        sets,
    };

    const exercises = JSON.parse(await fs.readFile('./exercises.json'));
    exercises.push(exercise);

    await fs.writeFile('./exercises.json', JSON.stringify(exercises));

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            success: true,
            data: exercise,
        })
    );
    return;
}

async function deleteExercise(id, res) {
    const exercises = JSON.parse(await fs.readFile('./exercises.json'));
    const exercise = exercises.find((exercise) => exercise.id === id);

    if (!exercise) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                message: 'Exercise not found!',
            })
        );
        return;
    }

    const updatedExercises = exercises.filter((exercise) => exercise.id !== id);

    await fs.writeFile('./exercises.json', JSON.stringify(updatedExercises));

    res.writeHead(204);
    res.end();
    return;
}

async function listExercises(res) {
    const exercises = JSON.parse(await fs.readFile('./exercises.json'));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            success: true,
            data: exercises,
        })
    );
    return;
}

async function readExecise(id, res) {
    const exercises = JSON.parse(await fs.readFile('./exercises.json'));
    const exercise = exercises.find((exercise) => exercise.id === id);

    if (!exercise) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                message: 'Exercise not found!',
            })
        );
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            success: true,
            data: exercise,
        })
    );
    return;
}

async function updateExercise(id, body, res) {
    const { description, load, name, reps, sets } = body;
    if (
        Object.keys({ description, load, name, reps, sets }).filter(
            (key) => body[key] === undefined
        ).length === 5
    ) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                message: 'The body must not be empty!',
            })
        );
        return;
    }

    const exercises = JSON.parse(await fs.readFile('./exercises.json'));
    const exercise = exercises.find((exercise) => exercise.id === id);

    if (!exercise) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                message: 'Exercise not found!',
            })
        );
        return;
    }

    const updatedExercise = {
        description: description ?? exercise.description,
        id,
        load: load ?? exercise.load,
        name: name ?? exercise.name,
        reps: reps ?? exercise.reps,
        sets: sets ?? exercise.sets,
    };

    const updatedExercises = exercises.map((exercise) =>
        exercise.id === id ? updatedExercise : exercise
    );

    await fs.writeFile('./exercises.json', JSON.stringify(updatedExercises));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            success: true,
            data: updatedExercise,
        })
    );
}

const requestHandler = (req, res) => {
    const { method, url } = req;

    let body = [];
    req.on('error', (err) => {
        console.error(err);
    });

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        res.on('error', (err) => {
            console.error(err);
        });

        if (body.length) {
            body = JSON.parse(Buffer.concat(body).toString());
        }

        if (method === 'POST' && url === '/exercises') {
            return createExercise(body, res);
        }

        if (method === 'GET' && url === '/exercises') {
            return listExercises(res);
        }

        if (
            method === 'GET' &&
            url.split('/')[1] === 'exercises' &&
            url.split('/')[2] !== undefined
        ) {
            const id = url.split('/')[2];
            return readExecise(id, res);
        }

        if (
            method === 'PATCH' &&
            url.split('/')[1] === 'exercises' &&
            url.split('/')[2] !== undefined
        ) {
            const id = url.split('/')[2];
            return updateExercise(id, body, res);
        }

        if (
            method === 'DELETE' &&
            url.split('/')[1] === 'exercises' &&
            url.split('/')[2] !== undefined
        ) {
            const id = url.split('/')[2];
            return deleteExercise(id, res);
        }

        // return 404 status code
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not found' }));
        return;
    });
};

export const app = createServer((req, res) => {
    setHeaders(res);
    requestHandler(req, res);
}).listen(80, () => {
    console.log('Server is listening on port 80');
});
