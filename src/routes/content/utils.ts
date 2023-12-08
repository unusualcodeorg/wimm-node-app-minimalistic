import Content from '../../database/model/Content';

export function statsBoostUp(content: Content) {
  if (content) {
    if (content.likes) content.likes = content.likes + 9 * content.likes;
    if (content.views) content.views = content.views + 17 * content.views;
    if (content.shares) content.shares = content.shares + 7 * content.shares;
  }
  return content;
}
