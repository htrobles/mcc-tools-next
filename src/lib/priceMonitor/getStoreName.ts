export const getStoreName = (store: string | null | undefined) => {
  switch (store) {
    case 'LM':
      return 'Long and McQuade';
    case 'REDONE':
      return 'RedOne';
    case null:
    case undefined:
      return null;
    default:
      return store as string;
  }
};
