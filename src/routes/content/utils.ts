import Content from '../../database/model/Content';

export function statsBoostUp(content: Content) {
  if (!content.likes) content.likes = 1;
  if (!content.views) content.views = 1;
  if (!content.shares) content.shares = 1;

  content.likes = content.likes + 9 * content.likes;
  content.views = content.views + 17 * content.views;
  content.shares = content.shares + 7 * content.shares;

  return content;
}
