export type Assignment = {
  id: string;
  subject: string;
  title: string;
  deadline: string;
  status: 'Not started' | 'In progress' | 'Completed';
  notes: string;
};