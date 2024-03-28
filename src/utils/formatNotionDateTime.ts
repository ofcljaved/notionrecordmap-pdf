import { formatDate } from './formatDate';

export interface NotionDateTime {
  type: 'datetime';
  start_date: string;
  start_time?: string;
  time_zone?: string;
}

export const formatNotionDateTime = (datetime: NotionDateTime) => {
  const dateString = `${datetime.start_date}T${
    datetime.start_time || '00:00'
  }+00:00`;
  return formatDate(dateString);
};
