import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        // Case-insensitive city filter
        city: query.city
          ? { equals: query.city, mode: "insensitive" }
          : undefined,

        // Case-insensitive breed filter
        breed: query.breed
          ? { equals: query.breed, mode: "insensitive" }
          : undefined,

        type: query.type || undefined,
        age: {
          gte: query.minAge ? parseInt(query.minAge) : undefined,
          lte: query.maxAge ? parseInt(query.maxAge) : undefined,
        },
        healthStatus:
          query.healthStatus && query.healthStatus !== "undefined"
            ? { has: query.healthStatus }
            : undefined,
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let isSaved = false;
    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        isSaved = !!saved;
      } catch (jwtError) {
        // Handle expired/invalid tokens gracefully
        console.log("JWT verification error:", jwtError);
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.log("Server error:", err);
    res.status(500).json({
      message: "Failed to get post",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true, // Post ile ilişkili PostDetail'i al
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // İlk olarak, ilişkili PostDetail'i sil
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: post.id }, // İlişkili PostDetail'i sil
      });
    }

    // Son olarak, Post'u sil
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post and its details deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
