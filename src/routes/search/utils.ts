import Content, { Category } from '../../database/model/Content';
import Mentor from '../../database/model/Mentor';
import Topic from '../../database/model/Topic';
import ContentRepo from '../../database/repository/ContentRepo';
import MentorRepo from '../../database/repository/MentorRepo';
import TopicRepo from '../../database/repository/TopicRepo';
import { UniversalSearchResult } from '../../types/client-types';

export async function searchMentors(query: string) {
  const searches = [MentorRepo.search(query, 10)];
  if (query.length >= 3) searches.push(MentorRepo.searchLike(query, 10));

  const results = await Promise.all(searches);
  const mentors: Mentor[] = [];

  for (const result of results) {
    for (const entry of result) {
      const found = mentors.find((m) => m._id.equals(entry._id));
      if (!found) mentors.push(entry);
    }
  }
  return mentors.map((m) => convertMentorToResult(m));
}

export async function searchTopics(query: string) {
  const searches = [TopicRepo.search(query, 10)];
  if (query.length >= 3) searches.push(TopicRepo.searchLike(query, 10));

  const results = await Promise.all(searches);
  const topics: Topic[] = [];

  for (const result of results) {
    for (const entry of result) {
      const found = topics.find((m) => m._id.equals(entry._id));
      if (!found) topics.push(entry);
    }
  }
  return topics.map((t) => convertTopicToResult(t));
}

export async function search(query: string) {
  const searches: UniversalSearchResult[] = [];

  const contents = await ContentRepo.search(query, 5);
  const mentors = await MentorRepo.search(query, 5);
  const topics = await TopicRepo.search(query, 5);

  searches.push(...contents.map((c) => convertContentToResult(c)));
  searches.push(...mentors.map((m) => convertMentorToResult(m)));
  searches.push(...topics.map((t) => convertTopicToResult(t)));

  if (query.length >= 3) {
    const similarContents = await ContentRepo.searchLike(query, 3);
    const similarMentors = await MentorRepo.searchLike(query, 3);
    const similarTopics = await TopicRepo.searchLike(query, 3);

    searches.push(...similarContents.map((c) => convertContentToResult(c)));
    searches.push(...similarMentors.map((m) => convertMentorToResult(m)));
    searches.push(...similarTopics.map((t) => convertTopicToResult(t)));
  }

  const data: UniversalSearchResult[] = [];

  for (const entry of searches) {
    const found = data.find((s) => s.id.equals(entry.id));
    if (!found) data.push(entry);
  }

  return data
}

function convertMentorToResult(mentor: Mentor) {
  return {
    id: mentor._id,
    title: mentor.name,
    contentType: Category.MENTOR_INFO,
    thumbnail: mentor.thumbnail,
    extra: mentor.occupation,
  } as UniversalSearchResult;
}

function convertTopicToResult(topic: Topic) {
  return {
    id: topic._id,
    title: topic.name,
    contentType: Category.TOPIC_INFO,
    thumbnail: topic.thumbnail,
    extra: topic.title,
  } as UniversalSearchResult;
}

function convertContentToResult(content: Content): UniversalSearchResult {
  return {
    id: content._id,
    title: content.title,
    contentType: content.category,
    thumbnail: content.thumbnail,
    extra: content.extra,
  } as UniversalSearchResult;
}
