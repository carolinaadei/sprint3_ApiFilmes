import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/filmes", async (req, res) => {
    try {
        const { titulo, ano, genero, direcao, descricao } = req.body;
        const filme = await prisma.filme.create({
            data: {
                titulo, ano, genero, direcao, descricao
            },
        });
        res.json(filme);
    } catch (error) {
        res.status(500).json("Error: Erro ao criar o filme!");
    }
});

app.put("/filmes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, ano, genero, direcao, descricao } = req.body;
        const filme = await prisma.filme.update({
            where: { id: Number(id) },
            data: { titulo, ano, genero, direcao, descricao }
        });
        res.json(filme);
    } catch (error) {
        res.status(500).json("Erro: Erro ao editar filme!");
    }
});

app.get("/filmes/:id", async (req, res) => {
    try {
        const filmes = await prisma.filme.findMany({ include: { reviews: true } });
        res.json(filmes);
    } catch (error) {
        res.status(500).json("Erro: Erro ao buscar filme!")
    }
});

app.delete("/filmes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.filme.delete({
            where: { id: Number(id) }
        });
        res.json({ message: "Filme deletado!" });
    } catch (error) {
        res.status(500).json("Erro: Erro ao deletar filme!");
    }
});

app.post("/filmes/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const { autor, comentario, nota } = req.body;
        const review = await prisma.review.create({
            data: {
                filmeId: Number(id),
                autor, 
                comentario, 
                nota
            },
        });
        res.json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar review!" });
    }
});


app.put("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { autor, comentario, nota } = req.body;
        const review = await prisma.review.update({
            where: { id: Number(id) }, 
            data: { autor, comentario, nota },
        });
        res.json(review); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Erro ao editar review!" }); 
    }
});


app.get("/filmes/:filmeId/reviews", async (req, res) => {
    try {
        const { filmeId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { filmeId: Number(filmeId) },
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json("Error: Erro ao buscar reviews!");
    }
});

app.delete("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.review.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Review deletado!" });
    } catch (error) {
        res.status(500).json("Error: Erro ao deletar review!");
    }
});

app.listen(3000, () => {
    console.log('Servidor está aberto!')
});