import metascraper from 'metascraper';
//@ts-ignore
import author from 'metascraper-author';
//@ts-ignore
import description from 'metascraper-description';
//@ts-ignore
import image from 'metascraper-image';
//@ts-ignore
import title from 'metascraper-title';
//@ts-ignore
import youtube from 'metascraper-youtube';
//@ts-ignore
import publisher from 'metascraper-publisher';
import axios from 'axios';
import { Category } from '../database/model/Content';

const scraper = metascraper([
  author(),
  description(),
  image(),
  title(),
  youtube(),
  publisher(),
]);

export interface MetaContent {
  contentType: string;
  title?: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  extra: string;
}

export async function scrapMetadata(url: string) {
  const response = await axios.get(url);
  const metadata = await scraper({
    html: response.data,
    url: url,
  });

  const data: MetaContent = {
    contentType: Category.ARTICLE,
    title: metadata.title,
    subtitle: metadata.author,
    description: metadata.description,
    thumbnail: metadata.image,
    extra: url,
  };


  if (
    url.includes('https://youtu.be') ||
    url.includes('https://www.youtube.com/watch')
  ){
    data.contentType = Category.YOUTUBE;
  }

  if (!data.subtitle) data.subtitle = metadata.publisher;
  if (!data.subtitle) data.subtitle = '';

  return data;
}
