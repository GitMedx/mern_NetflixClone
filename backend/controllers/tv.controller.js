import asyncHandler from "express-async-handler";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export const getTrendingTv = asyncHandler(async (req, res) => {
  const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");
  const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];
  res.json({ success: true, content: randomMovie });
});

export const getTvTrailers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`)
    res.json({ success: true, trailers: data.results });
});

export const getTvDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
    res.json({ success: true, content: data });
});

export const getSimilarTvs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`)
    res.json({ success: true, similar: data.results });
});

export const getTvsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`)
    res.json({ success: true, content: data.results });
});
