export enum ActionPostEnum {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export interface IActionPost {
  action: ActionPostEnum
}