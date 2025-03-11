import asyncHandler from "express-async-handler";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export const getTrendingMovie = asyncHandler(async (req, res) => {
  const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');
  const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];
  res.json({ success: true, content: randomMovie });
});

export const getMovieTrailers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
  res.json({ success: true, trailers: data.results });
});

export const getMovieDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
  res.status(200).json({ success: true, content: data });
});

export const getSimilarMovies = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
	res.status(200).json({ success: true, similar: data.results });
});

export const getMoviesByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
});
