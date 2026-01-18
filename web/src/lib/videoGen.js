import OpenAI from 'openai';

const openai = new OpenAI();

const video = await openai.videos.create({ prompt: 'A calico cat playing a piano on stage' });

console.log(video.id);
