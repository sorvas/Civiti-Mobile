export type NotificationRoute =
  | { screen: 'issue'; issueId: string }
  | { screen: 'achievements' }
  | { screen: 'badges' };

export type NotificationData = {
  route?: NotificationRoute;
};
